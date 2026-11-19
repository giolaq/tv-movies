import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { MovieCard } from './MovieCard';
import { movies } from './movies';
import { CARD_OUTER_WIDTH, columnsFor, nextIndex } from './navigation';

export function MovieList() {
  const [selected, setSelected] = useState(0);
  const selectedRef = useRef(0);
  const { width } = useWindowDimensions();
  const [gridWidth, setGridWidth] = useState(0);
  const columns = columnsFor(gridWidth || width - 80, CARD_OUTER_WIDTH);
  const columnsRef = useRef(columns);
  columnsRef.current = columns;
  const refs = useRef<(View | null)[]>([]);
  const movie = movies[selected];
  const select = useCallback((index: number) => {
    selectedRef.current = index;
    setSelected(index);
  }, []);
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handler = (event: KeyboardEvent) => {
      if (!event.key.startsWith('Arrow')) return;
      event.preventDefault();
      const current = selectedRef.current;
      const next = nextIndex(current, event.key, movies.length, columnsRef.current);
      const element = refs.current[next] as unknown as HTMLElement | null;
      if (!element) return;
      selectedRef.current = next;
      if (document.activeElement !== element) element.focus({ preventScroll: true });
      element.scrollIntoView({ block: 'nearest', behavior: event.repeat ? 'auto' : 'smooth' });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  return (
    <View style={s.root}>
      <View style={[s.nav, width < 600 && s.navCompact]}>
        <Text style={s.brand}>f<Text style={s.brandDot}>.</Text>  FRAME</Text>
        <View style={s.tabs}><Text numberOfLines={1} style={s.tabActive}>Discover</Text><Text numberOfLines={1} style={s.tab}>The collection</Text></View>
        <Text style={s.profile}>F</Text>
      </View>
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.hero}>
          <View style={s.heroCopy}>
            <Text style={s.eyebrow}>THE ART OF GETTING LOST IN A STORY</Text>
            <Text style={s.headline}>A world worth{ '\n' }watching.</Text>
            <Text style={s.subline}>Extraordinary stories. Unexpected perspectives. Find your next escape.</Text>
          </View>
          <View style={s.detail} accessibilityLiveRegion="polite">
            <Text style={s.detailKicker}>IN FOCUS  /  {String(selected + 1).padStart(2, '0')}</Text>
            <Text style={s.detailTitle}>{movie.title}</Text>
            <Text style={s.metadata}>★ {movie.rating}   ·   {movie.year}   ·   {movie.genre}</Text>
            <Text style={s.description}>{movie.description}</Text>
            <Text style={s.detailFoot}>A FRAME ORIGINAL  ↗</Text>
          </View>
        </View>
        <View style={s.collectionHead}><View><Text style={s.collectionTitle}>The collection</Text><Text style={s.collectionSub}>Good stories stay with you.</Text></View><Text style={s.count}>20 FILMS  /  HANDPICKED</Text></View>
        <View style={s.grid} onLayout={event => setGridWidth(event.nativeEvent.layout.width)}>
          {movies.map((item, index) => <MovieCard key={item.id} movie={item} active={selected === index} onFocus={() => select(index)} cardRef={ref => { refs.current[index] = ref; }} />)}
        </View>
        <Text style={s.footer}>FRAME  /  A LITTLE CURIOSITY GOES A LONG WAY.</Text>
      </ScrollView>
      <View style={s.help}><Text style={s.helpText}>↑ ↓ ← →  Explore the collection</Text><Text style={s.helpText}>TAB  Next film    ·    ENTER  Select    ·    Mouse supported</Text></View>
    </View>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d1518' },
  nav: { height: 84, paddingHorizontal: 40, flexDirection: 'row', alignItems: 'center', borderBottomColor: '#263035', borderBottomWidth: 1, gap: 65 },
  navCompact: { paddingHorizontal: 20, gap: 20 },
  brand: { color: '#f5f5e9', fontSize: 19, fontWeight: '800', letterSpacing: 3 },
  brandDot: { color: '#d9f99d', fontSize: 35 },
  tabs: { flex: 1, minWidth: 0, flexDirection: 'row', gap: 20, columnGap: 30, flexWrap: 'wrap', overflow: 'hidden', maxHeight: 20 },
  tabActive: { color: '#d9f99d', fontSize: 13 },
  tab: { color: '#909e9f', fontSize: 13 },
  profile: { color: '#d9f99d', backgroundColor: '#2b3731', borderRadius: 20, paddingHorizontal: 13, paddingVertical: 9, fontSize: 13 },
  content: { padding: 33, paddingBottom: 35 },
  hero: { flexDirection: 'row', flexWrap: 'wrap', gap: 30, paddingVertical: 14, marginBottom: 37 },
  heroCopy: { flexGrow: 1, flexBasis: 390, padding: 7 },
  eyebrow: { color: '#d9f99d', fontSize: 10, letterSpacing: 2, marginBottom: 18 },
  headline: { color: '#f0f2e9', fontSize: 49, fontWeight: '600', lineHeight: 54, letterSpacing: -2 },
  subline: { color: '#9ba8aa', fontSize: 13, marginTop: 18, maxWidth: 340, lineHeight: 21 },
  detail: { flexBasis: 340, flexGrow: 1, maxWidth: 450, backgroundColor: '#172428', borderRadius: 12, borderWidth: 1, borderColor: '#2c3b3d', padding: 26, justifyContent: 'center' },
  detailKicker: { color: '#b2ca98', fontSize: 10, letterSpacing: 2, marginBottom: 16 },
  detailTitle: { color: '#f0f2e9', fontSize: 27, fontWeight: '600' },
  metadata: { color: '#d4dfbf', fontSize: 12, marginTop: 12 },
  description: { color: '#acb8b7', lineHeight: 21, fontSize: 13, marginTop: 13 },
  detailFoot: { color: '#a8b89d', fontSize: 9, letterSpacing: 2, marginTop: 22 },
  collectionHead: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 7, marginBottom: 18 },
  collectionTitle: { color: '#f0f2e9', fontSize: 24, fontWeight: '600' },
  collectionSub: { color: '#879698', fontSize: 12, marginTop: 7 },
  count: { color: '#9ca99c', fontSize: 9, letterSpacing: 1.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  footer: { color: '#697c7e', fontSize: 9, letterSpacing: 2, marginTop: 35, marginLeft: 7 },
  help: { paddingVertical: 13, paddingHorizontal: 40, borderTopWidth: 1, borderColor: '#263035', flexDirection: 'row', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' },
  helpText: { color: '#a0afa9', fontSize: 10 },
});
