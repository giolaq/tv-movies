import { useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { Movie } from './movies';
import { CARD_MARGIN } from './navigation';

type PosterState = 'loading' | 'loaded' | 'failed';

export function MovieCard({ movie, width, artHeight, active, preferred, onFocus, onSelect, canHover, cardRef }: {
  movie: Movie; width: number; artHeight: number; active: boolean; preferred: boolean; onFocus: () => void; onSelect: () => void;
  canHover: () => boolean;
  cardRef: (ref: View | null) => void;
}) {
  const [poster, setPoster] = useState<PosterState>('loading');
  const opacity = useRef(new Animated.Value(0)).current;
  const onLoad = () => {
    setPoster('loaded');
    Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: Platform.OS !== 'web' }).start();
  };
  const { width: windowWidth } = useWindowDimensions();
  const web = Platform.OS === 'web';
  const narrow = web && windowWidth < 600;
  return (
    <Pressable ref={cardRef} accessibilityRole="button"
      accessibilityLabel={movie.title + ', ' + movie.year + ', rated ' + movie.rating}
      hasTVPreferredFocus={preferred} onFocus={onFocus} onPress={onSelect}
      onHoverIn={() => {
        if (Platform.OS === 'web' || !canHover()) return;
        onFocus();
      }}
      style={[s.card, { width }, Platform.OS === 'web' && s.pointer, active && s.active]}>
      <View style={[s.art, web ? s.responsiveArt : { height: artHeight }, web && !narrow && { maxHeight: artHeight }]}>
        {poster !== 'loaded' && (
          <View style={[s.fallback, web && s.webFallback]}>
            <Text numberOfLines={3} style={[s.fallbackTitle, web && s.webFallbackTitle, poster === 'loading' && s.loadingTitle]}>{movie.title}</Text>
            <Text style={[s.fallbackLabel, web && s.webFallbackLabel]}>{poster === 'loading' ? 'LOADING POSTER…' : 'FRAME ORIGINAL'}</Text>
          </View>
        )}
        {poster !== 'failed' && (
          <Animated.Image source={{ uri: movie.poster }} accessibilityIgnoresInvertColors
            style={[s.image, { opacity }]} onLoad={onLoad} onError={() => setPoster('failed')} />
        )}
        <View style={s.score}><Text style={[s.scoreText, Platform.isTV && s.tvScore, web && s.webScoreText, narrow && s.narrowScoreText]}>★ {movie.rating}</Text></View>
      </View>
      <Text numberOfLines={web ? (narrow ? 2 : 1) : undefined} style={[s.title, Platform.isTV && s.tvTitle, web && s.webTitle, narrow && s.narrowTitle]}>{movie.title}</Text>
      <Text style={[s.year, Platform.isTV && s.tvYear, web && s.webYear, narrow && s.narrowYear]}>{movie.year}  ·  {movie.genre}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  card: { padding: 5, borderWidth: 4, borderColor: 'transparent', borderRadius: 12, margin: CARD_MARGIN },
  active: { borderColor: '#d9f99d', backgroundColor: '#222d26' },
  art: { height: 300, borderRadius: 7, overflow: 'hidden', backgroundColor: '#283c38' },
  pointer: { cursor: 'pointer' },
  responsiveArt: { height: undefined, aspectRatio: 2 / 3 },
  webScoreText: { fontSize: 16 },
  webTitle: { fontSize: 18, lineHeight: 24 },
  webYear: { fontSize: 14, lineHeight: 20 },
  narrowScoreText: { fontSize: 12 },
  narrowTitle: { fontSize: 16, lineHeight: 21 },
  narrowYear: { fontSize: 12, lineHeight: 17 },
  image: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  fallback: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', padding: 20 },
  fallbackTitle: { color: '#e8efdf', fontSize: 25, fontWeight: '700' },
  webFallback: { padding: 12, paddingTop: 40 },
  webFallbackTitle: { fontSize: 17, lineHeight: 22 },
  webFallbackLabel: { fontSize: 11, letterSpacing: 1, marginTop: 10 },
  loadingTitle: { color: '#7f938c' },
  fallbackLabel: { color: '#d9f99d', fontSize: 24, fontWeight: '500', marginTop: 15 },
  score: { position: 'absolute', top: 10, right: 8, backgroundColor: '#101815', padding: 5, borderRadius: 5 },
  scoreText: { color: '#e8f2d9', fontSize: 24, fontWeight: '700' },
  title: { color: '#f2f3ee', fontSize: 28, fontWeight: '600', marginTop: 12 },
  year: { color: '#96a29f', fontSize: 24, fontWeight: '500', marginTop: 5, marginBottom: 5 },
  tvScore: { fontSize: 12 },
  tvTitle: { fontSize: 16, marginTop: 8 },
  tvYear: { fontSize: 13 },
});
