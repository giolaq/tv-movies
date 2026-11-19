import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Platform, ScrollView, StyleSheet, Text, TVEventControl, View, useWindowDimensions } from 'react-native';
import { MovieCard } from './MovieCard';
import { MovieDetails } from './MovieDetails';
import { movies, type Movie } from './movies';
import { columnsForWidth, isBackEvent, nextIndex } from './navigation';
import { formatRuntime } from './runtime';

type BackSource = { addEventListener: (event: 'hardwareBackPress', handler: () => boolean) => { remove: () => void } };

function focusView(view: View | null) {
  if (Platform.OS === 'web') {
    (view as unknown as HTMLElement | null)?.focus({ preventScroll: true });
  } else {
    (view as (View & { requestTVFocus?: () => void }) | null)?.requestTVFocus?.();
  }
}

function MovieInfo({ movie }: { movie: Movie }) {
  return <View style={s.info} accessibilityLiveRegion="polite">
    <Text style={s.title}>{movie.title}</Text>
    <Text style={s.metadata}>★ {movie.rating}  ·  {movie.year}  ·  {formatRuntime(movie.runtime)}  ·  {movie.genre}</Text>
    <Text style={s.description}>{movie.description}</Text>
  </View>;
}

export function MovieList({ backHandler = BackHandler }: { backHandler?: BackSource } = {}) {
  const [selected, setSelected] = useState(0);
  const [details, setDetails] = useState(false);
  const [gridWidth, setGridWidth] = useState(0);
  const { width, height } = useWindowDimensions();
  const horizontal = width * 0.05;
  const vertical = height * 0.05;
  const columns = columnsForWidth(gridWidth || width - horizontal * 2);
  const refs = useRef<(View | null)[]>([]);
  const gridRef = useRef<ScrollView | null>(null);
  const scrollOffset = useRef(0);
  const savedOffset = useRef(0);
  const movie = movies[selected] ?? movies[0];
  const closeDetails = useCallback(() => setDetails(false), []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!details) {
        gridRef.current?.scrollTo({ y: savedOffset.current, animated: false });
        focusView(refs.current[selected]);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [details]);

  useEffect(() => {
    if (Platform.OS === 'web' || !details) return;
    const subscription = backHandler?.addEventListener('hardwareBackPress', () => {
      closeDetails();
      return true;
    });
    if (Platform.OS === 'ios') TVEventControl?.enableTVMenuKey?.();
    return () => {
      subscription?.remove();
      if (Platform.OS === 'ios') TVEventControl?.disableTVMenuKey?.();
    };
  }, [backHandler, closeDetails, details]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handler = (event: KeyboardEvent) => {
      if (isBackEvent(event.key)) {
        event.preventDefault();
        closeDetails();
        return;
      }
      if (details) {
        if (event.key.startsWith('Arrow') || event.key === 'Tab') {
          event.preventDefault();
        }
        return;
      }
      if (!movie || !event.key.startsWith('Arrow')) return;
      event.preventDefault();
      const next = nextIndex(selected, event.key, movies.length, columns);
      const element = refs.current[next] as unknown as HTMLElement | null;
      element?.focus({ preventScroll: true });
      element?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected, columns, details, movie, closeDetails]);

  return <View style={[s.root, { paddingHorizontal: horizontal, paddingVertical: vertical }]}>
    <View style={s.list} pointerEvents={details ? 'none' : 'auto'} accessibilityElementsHidden={details} importantForAccessibility={details ? 'no-hide-descendants' : 'auto'}>
      <View style={s.header}><Text style={s.brand}>f.  FRAME</Text><Text style={s.label}>THE COLLECTION  /  {movies.length} FILMS</Text></View>
      {movie ? <>
        <MovieInfo movie={movie} />
        <ScrollView ref={gridRef} style={s.scroll} scrollEventThrottle={16}
          onScroll={event => { scrollOffset.current = event.nativeEvent.contentOffset.y; }}>
          <View style={s.grid} onLayout={event => setGridWidth(event.nativeEvent.layout.width)}>
          {movies.map((item, index) => <MovieCard key={item.id} movie={item} active={selected === index} disabled={details}
            onFocus={() => setSelected(index)} onSelect={() => { setSelected(index); savedOffset.current = scrollOffset.current; setDetails(true); }}
            cardRef={ref => { refs.current[index] = ref; }} />)}
          </View>
        </ScrollView>
      </> : <View style={s.empty}><Text style={s.title}>No movies available</Text></View>}
      <View style={s.help}><Text style={s.hint}>↑ ↓ ← →  Browse films</Text><Text style={s.hint}>OK / ENTER  Details</Text></View>
    </View>
    {details && movie && <MovieDetails key={movie.id} movie={movie} onClose={closeDetails} />}
  </View>;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d1518' },
  list: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  brand: { color: '#d9f99d', fontSize: 26, fontWeight: '800', letterSpacing: 2 },
  label: { color: '#b8c5c1', fontSize: 20 },
  info: { paddingVertical: 16, gap: 14 },
  title: { color: '#f0f2e9', fontSize: 40, lineHeight: 48, fontWeight: '600' },
  metadata: { color: '#d4dfbf', fontSize: 22, lineHeight: 30 },
  description: { color: '#c2ceca', fontSize: 26, lineHeight: 36 },
  scroll: { flex: 1, marginTop: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 12 },
  help: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 22 },
  hint: { color: '#c2ceca', fontSize: 20, lineHeight: 28 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
