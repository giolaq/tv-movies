import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Platform, Pressable, ScrollView, StyleSheet, Text, TVEventControl, View, useWindowDimensions } from 'react-native';
import { MovieCard } from './MovieCard';
import { MovieDetails } from './MovieDetails';
import { movies } from './movies';
import { columnsForWidth, isBackEvent, leavesGridTop, nextIndex } from './navigation';
import { formatRuntime } from './runtime';

const tabs = ['Discover', 'The collection'];
type Zone = 'nav' | 'grid';
const asElement = (ref: View | null) => ref as unknown as HTMLElement | null;

type BackSource = { addEventListener: (event: 'hardwareBackPress', handler: () => boolean) => { remove: () => void } };

export function MovieList({ backHandler = BackHandler }: { backHandler?: BackSource } = {}) {
  const [selected, setSelected] = useState(0);
  const { width, height } = useWindowDimensions();
  const compact = height < 900 || width < 1600;
  const safeX = Math.round(width * 0.05);
  const cardWidth = Math.min(320, width - safeX * 2 - 14);
  const [columns, setColumns] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [zone, setZone] = useState<Zone>('grid');
  const [tab, setTab] = useState(0);
  const [focusedTab, setFocusedTab] = useState(0);
  const refs = useRef<(View | null)[]>([]);
  const tabRefs = useRef<(View | null)[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const collectionY = useRef(0);
  const restoreFocus = useRef(false);
  const usingRemote = useRef(true);
  const canHover = useCallback(() => !usingRemote.current, []);
  const movie = movies[selected];
  const openDetails = (index: number) => {
    setSelected(index);
    setShowDetails(true);
    if (Platform.OS === 'web') window.history.pushState({ detail: movies[index].id }, '');
  };
  const dismissDetails = useCallback(() => {
    restoreFocus.current = true;
    setShowDetails(false);
  }, []);
  const closeDetails = useCallback(() => {
    if (Platform.OS === 'web' && window.history.state?.detail) window.history.back();
    else dismissDetails();
  }, [dismissDetails]);
  const selectTab = (index: number) => {
    setTab(index);
    scrollRef.current?.scrollTo({ y: index === 1 && compact ? collectionY.current : 0, animated: true });
  };
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const frame = requestAnimationFrame(() => asElement(refs.current[0])?.focus());
    const onPopState = (event: PopStateEvent) => {
      const index = movies.findIndex(item => item.id === event.state?.detail);
      if (index < 0) { dismissDetails(); return; }
      setSelected(index);
      setShowDetails(true);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.movementX || event.movementY) usingRemote.current = false;
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('pointermove', onPointerMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [dismissDetails]);
  useEffect(() => {
    if (showDetails || !restoreFocus.current) return;
    restoreFocus.current = false;
    const frame = requestAnimationFrame(() => {
      const card = refs.current[selected];
      if (Platform.OS === 'web') (card as unknown as HTMLElement | null)?.focus();
      else card?.setNativeProps({ hasTVPreferredFocus: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [showDetails, selected]);
  useEffect(() => {
    if (!showDetails || Platform.OS === 'web') return;
    const back = backHandler?.addEventListener('hardwareBackPress', () => {
      closeDetails();
      return true;
    });
    if (Platform.OS === 'ios') TVEventControl?.enableTVMenuKey?.();
    return () => {
      back?.remove();
      if (Platform.OS === 'ios') TVEventControl?.disableTVMenuKey?.();
    };
  }, [showDetails, closeDetails, backHandler]);
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const element = refs.current[selected] as unknown as HTMLElement | null;
    const frame = requestAnimationFrame(() => element?.scrollIntoView({ block: selected < columns ? 'end' : 'nearest' }));
    return () => cancelAnimationFrame(frame);
  }, [selected, showDetails, compact, columns]);
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handler = (event: KeyboardEvent) => {
      usingRemote.current = true;
      if (showDetails) {
        if (isBackEvent(event.key)) {
          event.preventDefault();
          closeDetails();
        }
        return;
      }
      if (!event.key.startsWith('Arrow')) return;
      event.preventDefault();
      const active = document.activeElement;
      const tabIndex = tabRefs.current.findIndex(ref => asElement(ref) === active);
      if (tabIndex >= 0) {
        if (event.key === 'ArrowDown') asElement(refs.current[selected])?.focus();
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          const next = Math.max(0, Math.min(tabs.length - 1, tabIndex + (event.key === 'ArrowRight' ? 1 : -1)));
          asElement(tabRefs.current[next])?.focus();
        }
        return;
      }
      const current = refs.current.findIndex(ref => asElement(ref) === active);
      if (current < 0) { asElement(refs.current[selected])?.focus(); return; }
      if (leavesGridTop(current, event.key, columns)) {
        asElement(tabRefs.current[tab])?.focus();
        scrollRef.current?.scrollTo({ y: 0, animated: true });
        return;
      }
      asElement(refs.current[nextIndex(current, event.key, movies.length, columns)])?.focus();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected, columns, tab, showDetails, closeDetails]);
  const header = movie ? (
    <View>
        <View style={[s.hero, { marginHorizontal: compact ? 7 : safeX }]}>
          <View style={s.detail} accessibilityLiveRegion="polite">
            <View style={s.focusHeading}>
              <Text style={s.detailKicker}>IN FOCUS  /  {String(selected + 1).padStart(2, '0')}</Text>
              <Text style={s.detailTitle}>{movie.title}</Text>
              <Text style={s.metadata}>★ {movie.rating}   ·   {movie.year}   ·   {formatRuntime(movie.runtime)}   ·   {movie.genre}</Text>
            </View>
            <Text numberOfLines={1} style={s.description}>{movie.description}</Text>
          </View>
        </View>
        <View onLayout={event => { collectionY.current = event.nativeEvent.layout.y; }} style={[s.collectionHead, { marginHorizontal: compact ? 7 : safeX }]}><Text style={s.collectionTitle}>The collection</Text><Text style={s.count}>{movies.length} FILMS  /  HANDPICKED</Text></View>
    </View>
  ) : <Text style={[s.collectionTitle, { marginHorizontal: safeX }]}>No movies available</Text>;
  const gridContent = (
    <View>
        <View style={s.grid} onLayout={event => {
          if (event.nativeEvent.layout.width > 0) setColumns(columnsForWidth(event.nativeEvent.layout.width, cardWidth));
        }}>
          {movies.map((item, index) => <MovieCard key={item.id} movie={item} width={cardWidth} artHeight={Math.min(180, Math.round(height * 0.22))} active={zone === 'grid' && selected === index}
            preferred={index === 0} canHover={canHover} onFocus={() => { setZone('grid'); setSelected(index); }} onSelect={() => openDetails(index)} cardRef={ref => { refs.current[index] = ref; }} />)}
        </View>
        <Text style={s.footer}>FRAME  /  A LITTLE CURIOSITY GOES A LONG WAY.</Text>
    </View>
  );
  return (
    <View style={[s.root, { paddingTop: 54, paddingBottom: 54 }]}>
      <View style={[s.nav, { paddingHorizontal: safeX }]}>
        <Text style={s.brand}>f<Text style={s.brandDot}>.</Text>  FRAME</Text>
        <View style={s.tabs}>
          {tabs.map((label, index) => {
            const text = <Text style={[s.tab, tab === index && s.tabActive, !showDetails && zone === 'nav' && focusedTab === index && s.tabTextFocused]}>{label}</Text>;
            if (showDetails) return <View key={label} style={s.tabButton}>{text}</View>;
            return (
              <Pressable key={label} ref={ref => { tabRefs.current[index] = ref; }} accessibilityRole="tab"
                accessibilityState={{ selected: tab === index }}
                onFocus={() => { setZone('nav'); setFocusedTab(index); }} onPress={() => selectTab(index)}
                style={[s.tabButton, zone === 'nav' && focusedTab === index && s.tabFocused]}>
                {text}
              </Pressable>
            );
          })}
        </View>
        <Text style={s.profile}>F</Text>
      </View>
      {showDetails && movie && <MovieDetails movie={movie} onClose={closeDetails} />}
      <View style={[s.collection, showDetails && { display: 'none' }]}>
        {!compact && header}
      <ScrollView ref={scrollRef} style={s.scroller} contentContainerStyle={[s.content, { paddingHorizontal: safeX - 7 }]}>
        {compact && header}
        {gridContent}
      </ScrollView>
      </View>
      <View style={[s.help, { paddingHorizontal: safeX }]}><Text style={s.helpText}>↑ ↓ ← →  Move</Text><Text style={s.helpText}>{showDetails ? 'BACK  Return to the collection' : 'OK  Open details    ·    ↑ from the top row  Menu'}</Text></View>
    </View>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d1518' },
  nav: { height: 84, paddingHorizontal: 40, flexDirection: 'row', alignItems: 'center', borderBottomColor: '#263035', borderBottomWidth: 1, gap: 65 },
  brand: { color: '#f5f5e9', fontSize: 28, fontWeight: '800', letterSpacing: 3 },
  brandDot: { color: '#d9f99d', fontSize: 35 },
  tabs: { flex: 1, flexDirection: 'row', gap: 12 },
  tabButton: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 28, borderWidth: 2, borderColor: 'transparent' },
  tabFocused: { borderColor: '#d9f99d', backgroundColor: '#d9f99d' },
  tabTextFocused: { color: '#0d1518', fontWeight: '700' },
  tabActive: { color: '#d9f99d', fontSize: 24, fontWeight: '500' },
  tab: { color: '#909e9f', fontSize: 24, fontWeight: '500' },
  profile: { color: '#d9f99d', backgroundColor: '#2b3731', borderRadius: 20, paddingHorizontal: 13, paddingVertical: 9, fontSize: 24, fontWeight: '500' },
  collection: { flex: 1, minHeight: 0 },
  scroller: { flex: 1, minHeight: 0 },
  content: { paddingBottom: 20 },
  hero: { flexDirection: 'row', paddingVertical: 8 },
  detail: { flex: 1, backgroundColor: '#172428', borderRadius: 12, borderWidth: 1, borderColor: '#2c3b3d', padding: 16 },
  focusHeading: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 20 },
  detailKicker: { color: '#b2ca98', fontSize: 24, fontWeight: '500', letterSpacing: 2 },
  detailTitle: { color: '#f0f2e9', fontSize: 36, fontWeight: '600' },
  metadata: { color: '#d4dfbf', fontSize: 24, fontWeight: '500' },
  description: { color: '#acb8b7', lineHeight: 34, fontSize: 24, fontWeight: '500', marginTop: 6 },
  collectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginHorizontal: 7, marginBottom: 8 },
  collectionTitle: { color: '#f0f2e9', fontSize: 36, fontWeight: '600' },
  count: { color: '#9ca99c', fontSize: 24, fontWeight: '500', letterSpacing: 1.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  footer: { color: '#a0afa9', fontSize: 24, fontWeight: '500', letterSpacing: 2, marginTop: 35, marginLeft: 7 },
  help: { paddingVertical: 13, paddingHorizontal: 40, borderTopWidth: 1, borderColor: '#263035', flexDirection: 'row', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' },
  helpText: { color: '#a0afa9', fontSize: 24, fontWeight: '500' },
});
