import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Platform, Pressable, ScrollView, StyleSheet, Text, TVEventHandler, View, useWindowDimensions } from 'react-native';
import { MovieCard } from './MovieCard';
import { MovieDetails } from './MovieDetails';
import { movies } from './movies';
import { CARD_MARGIN, CARD_WIDTH, columnsForWidth, isBackEvent, nextIndex } from './navigation';
import { createPointerMovementTracker } from './pointerMovement';

export function MovieList() {
  const [selected, setSelected] = useState(0);
  const { width, height } = useWindowDimensions();
  const web = Platform.OS === 'web';
  const narrow = web && width < 600;
  const compact = height < 900 || width < 1600;
  const safeX = Math.round(width * 0.05);
  const [gridWidth, setGridWidth] = useState(0);
  const nativeCardWidth = Math.min(320, width - safeX * 2 - 14);
  const columns = Math.max(web ? 2 : 1, columnsForWidth(gridWidth, web ? CARD_WIDTH : nativeCardWidth));
  const cardWidth = web && gridWidth ? gridWidth / columns - 2 * CARD_MARGIN : nativeCardWidth;
  const [showDetails, setShowDetails] = useState(false);
  const refs = useRef<(View | null)[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const collectionRef = useRef<View>(null);
  const headerNavigation = useRef(false);
  const navigateCollection = (top: boolean) => {
    if (!web) return;
    headerNavigation.current = showDetails;
    setShowDetails(false);
    requestAnimationFrame(() => {
      if (top) scrollRef.current?.scrollTo({ y: 0, animated: true });
      else (collectionRef.current as unknown as HTMLElement | null)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  };
  const restoreFocus = useRef(false);
  useEffect(() => {
    if (!web) return;
    const moved = createPointerMovementTracker();
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !moved(event.clientX, event.clientY)) return;
      if (showDetails) return;
      const card = refs.current.find(ref => (ref as unknown as HTMLElement | null)?.contains(event.target as Node));
      (card as unknown as HTMLElement | undefined)?.focus();
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [web, showDetails]);
  const movie = movies[selected];
  const closeDetails = useCallback(() => {
    restoreFocus.current = true;
    setShowDetails(false);
  }, []);
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
    const back = BackHandler.addEventListener('hardwareBackPress', () => {
      closeDetails();
      return true;
    });
    const tv = TVEventHandler?.addListener?.(event => {
      if (isBackEvent(event.eventType)) closeDetails();
    });
    return () => { back.remove(); tv?.remove(); };
  }, [showDetails, closeDetails]);
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (headerNavigation.current) {
      headerNavigation.current = false;
      return;
    }
    if (showDetails) return;
    const element = refs.current[selected] as unknown as HTMLElement | null;
    const frame = requestAnimationFrame(() => element?.scrollIntoView({ block: 'nearest' }));
    return () => cancelAnimationFrame(frame);
  }, [selected, showDetails, compact]);
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handler = (event: KeyboardEvent) => {
      if (showDetails) {
        if (isBackEvent(event.key)) {
          event.preventDefault();
          closeDetails();
        }
        return;
      }
      if (!event.key.startsWith('Arrow')) return;
      event.preventDefault();
      const next = nextIndex(selected, event.key, movies.length, columns);
      const element = refs.current[next] as unknown as HTMLElement | null;
      element?.focus();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected, columns, showDetails, closeDetails]);
  const header = (
    <View>
        <View style={[s.hero, { marginHorizontal: compact ? 7 : safeX }, narrow && s.narrowHero]}>
          <View style={[s.heroCopy, narrow && s.narrowHeroCopy]}>
            <Text style={s.eyebrow}>THE ART OF GETTING LOST IN A STORY</Text>
            <Text style={[s.headline, narrow && s.narrowHeadline]}>A world worth watching.</Text>
            <Text style={s.subline}>Extraordinary stories. Unexpected perspectives. Find your next escape.</Text>
          </View>
          <View style={[s.detail, narrow && s.narrowDetail]} accessibilityLiveRegion="polite">
            <Text style={s.detailKicker}>IN FOCUS  /  {String(selected + 1).padStart(2, '0')}</Text>
            <Text style={s.detailTitle}>{movie.title}</Text>
            <Text style={s.metadata}>★ {movie.rating}   ·   {movie.year}   ·   {movie.genre}</Text>
            <Text style={s.description}>{movie.description}</Text>
            <Text style={s.detailFoot}>A FRAME ORIGINAL  ↗</Text>
          </View>
        </View>
        <View ref={collectionRef} style={[s.collectionHead, { marginHorizontal: compact ? 7 : safeX }, narrow && s.narrowCollectionHead]}><View><Text style={s.collectionTitle}>The collection</Text><Text style={s.collectionSub}>Good stories stay with you.</Text></View><Text style={s.count}>20 FILMS  /  HANDPICKED</Text></View>
    </View>
  );
  const gridContent = (
    <View>
        <View style={s.grid} onLayout={event => {
          if (event.nativeEvent.layout.width > 0) setGridWidth(event.nativeEvent.layout.width);
        }}>
          {movies.map((item, index) => <MovieCard key={item.id} movie={item} width={cardWidth} artHeight={compact ? Math.min(300, Math.round(height * 0.22)) : 300} active={selected === index} onFocus={() => setSelected(index)} onSelect={() => { setSelected(index); setShowDetails(true); }} cardRef={ref => { refs.current[index] = ref; }} />)}
        </View>
        <Text style={s.footer}>FRAME  /  A LITTLE CURIOSITY GOES A LONG WAY.</Text>
    </View>
  );
  return (
    <View style={[s.root, { paddingTop: web ? 0 : 54, paddingBottom: web ? 0 : 54 }]}>
      <View style={[s.nav, { paddingHorizontal: safeX }, web && s.webNav, narrow && s.narrowNav]}>
        <Text style={s.brand}>f<Text style={s.brandDot}>.</Text>  FRAME</Text>
        {!web && <View style={s.tabs}><Text style={s.tabActive}>Discover</Text><Text style={s.tab}>The collection</Text></View>}
        {web && !narrow && <View style={s.tabs}>
          <Pressable accessibilityRole="button" onPress={() => navigateCollection(true)} style={web && s.pointer}>
            {state => <Text style={[s.tabActive, web && (state as typeof state & { hovered?: boolean }).hovered && s.tabHover]}>Discover</Text>}
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => navigateCollection(false)} style={web && s.pointer}>
            {state => <Text style={[s.tab, web && (state as typeof state & { hovered?: boolean }).hovered && s.tabHover]}>The collection</Text>}
          </Pressable>
        </View>}
        <Text style={s.profile}>F</Text>
      </View>
      {showDetails && <MovieDetails movie={movie} onClose={closeDetails} />}
      <View style={[s.collection, showDetails && { display: 'none' }]}>
        {!compact && header}
      <ScrollView ref={scrollRef} style={s.scroller} contentContainerStyle={[s.content, { paddingHorizontal: safeX - 7 }, narrow && s.narrowContent]}>
        {compact && header}
        {gridContent}
      </ScrollView>
      </View>
      {!narrow && <View style={[s.help, { paddingHorizontal: safeX }]}><Text style={s.helpText}>↑ ↓ ← →  Explore the collection</Text><Text style={s.helpText}>TAB  Next film    ·    ENTER  Select    ·    Mouse supported</Text></View>}
    </View>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d1518' },
  pointer: { cursor: 'pointer' },
  tabHover: { color: '#f5f5e9' },
  webNav: { gap: 24 },
  narrowNav: { paddingHorizontal: 22, gap: 16, justifyContent: 'space-between', height: 70 },
  narrowContent: { padding: 14, paddingBottom: 28 },
  narrowHero: { gap: 24, marginBottom: 26 },
  narrowHeroCopy: { flexBasis: '100%', flexShrink: 1 },
  narrowHeadline: { fontSize: 38, lineHeight: 43, letterSpacing: -1.5 },
  narrowDetail: { flexBasis: '100%', flexShrink: 1, padding: 21 },
  narrowCollectionHead: { flexDirection: 'column', alignItems: 'flex-start', gap: 14 },
  nav: { height: 84, paddingHorizontal: 40, flexDirection: 'row', alignItems: 'center', borderBottomColor: '#263035', borderBottomWidth: 1, gap: 65 },
  brand: { color: '#f5f5e9', fontSize: 28, fontWeight: '800', letterSpacing: 3 },
  brandDot: { color: '#d9f99d', fontSize: 35 },
  tabs: { flex: 1, flexDirection: 'row', gap: 30 },
  tabActive: { color: '#d9f99d', fontSize: 24, fontWeight: '500' },
  tab: { color: '#909e9f', fontSize: 24, fontWeight: '500' },
  profile: { color: '#d9f99d', backgroundColor: '#2b3731', borderRadius: 20, paddingHorizontal: 13, paddingVertical: 9, fontSize: 24, fontWeight: '500' },
  collection: { flex: 1, minHeight: 0 },
  scroller: { flex: 1, minHeight: 0 },
  content: { paddingBottom: 20 },
  hero: { flexDirection: 'row', flexWrap: 'wrap', gap: 24, paddingVertical: 16 },
  heroCopy: { flexGrow: 1, flexBasis: 390, justifyContent: 'center' },
  eyebrow: { color: '#d9f99d', fontSize: 24, fontWeight: '500', letterSpacing: 2, marginBottom: 12 },
  headline: { color: '#f0f2e9', fontSize: 52, fontWeight: '600', lineHeight: 58, letterSpacing: -2 },
  subline: { color: '#9ba8aa', fontSize: 24, fontWeight: '500', marginTop: 12, maxWidth: 800, lineHeight: 34 },
  detail: { flexBasis: 540, flexGrow: 1, maxWidth: 680, minHeight: 256, backgroundColor: '#172428', borderRadius: 12, borderWidth: 1, borderColor: '#2c3b3d', padding: 16, justifyContent: 'center' },
  detailKicker: { color: '#b2ca98', fontSize: 24, fontWeight: '500', letterSpacing: 2, marginBottom: 6 },
  detailTitle: { color: '#f0f2e9', fontSize: 36, fontWeight: '600' },
  metadata: { color: '#d4dfbf', fontSize: 24, fontWeight: '500', marginTop: 6 },
  description: { color: '#acb8b7', lineHeight: 34, fontSize: 24, fontWeight: '500', marginTop: 6 },
  detailFoot: { color: '#a8b89d', fontSize: 24, fontWeight: '500', letterSpacing: 2, marginTop: 8 },
  collectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginHorizontal: 7, marginBottom: 18 },
  collectionTitle: { color: '#f0f2e9', fontSize: 36, fontWeight: '600' },
  collectionSub: { color: '#879698', fontSize: 24, fontWeight: '500', marginTop: 7 },
  count: { color: '#9ca99c', fontSize: 24, fontWeight: '500', letterSpacing: 1.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  footer: { color: '#a0afa9', fontSize: 24, fontWeight: '500', letterSpacing: 2, marginTop: 35, marginLeft: 7 },
  help: { paddingVertical: 13, paddingHorizontal: 40, borderTopWidth: 1, borderColor: '#263035', flexDirection: 'row', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' },
  helpText: { color: '#a0afa9', fontSize: 24, fontWeight: '500' },
});
