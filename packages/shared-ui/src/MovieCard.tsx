import { useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
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
  return (
    <Pressable ref={cardRef} accessibilityRole="button"
      accessibilityLabel={movie.title + ', ' + movie.year + ', rated ' + movie.rating}
      hasTVPreferredFocus={preferred} onFocus={onFocus} onPress={onSelect}
      onHoverIn={event => {
        if (!canHover()) return;
        onFocus();
        if (Platform.OS === 'web') (event.currentTarget as unknown as HTMLElement).focus();
      }}
      style={[s.card, { width }, active && s.active]}>
      <View style={[s.art, { height: artHeight }]}>
        {poster !== 'loaded' && (
          <View style={s.fallback}>
            <Text numberOfLines={3} style={[s.fallbackTitle, poster === 'loading' && s.loadingTitle]}>{movie.title}</Text>
            <Text style={s.fallbackLabel}>{poster === 'loading' ? 'LOADING POSTER…' : 'FRAME ORIGINAL'}</Text>
          </View>
        )}
        {poster !== 'failed' && (
          <Animated.Image source={{ uri: movie.poster }} accessibilityIgnoresInvertColors
            style={[s.image, { opacity }]} onLoad={onLoad} onError={() => setPoster('failed')} />
        )}
        <View style={s.score}><Text style={[s.scoreText, Platform.isTV && s.tvScore]}>★ {movie.rating}</Text></View>
        <View style={[s.caption, Platform.isTV && s.tvCaption]}><Text style={[s.captionText, Platform.isTV && s.tvCaptionText]}>{movie.genre.toUpperCase()}</Text></View>
      </View>
      <Text style={[s.title, Platform.isTV && s.tvTitle]}>{movie.title}</Text>
      <Text style={[s.year, Platform.isTV && s.tvYear]}>{movie.year}  ·  {movie.genre}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  card: { padding: 5, borderWidth: 4, borderColor: 'transparent', borderRadius: 12, margin: CARD_MARGIN },
  active: { borderColor: '#d9f99d', backgroundColor: '#222d26' },
  art: { height: 300, borderRadius: 7, overflow: 'hidden', backgroundColor: '#283c38' },
  image: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  fallback: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', padding: 20, paddingBottom: 60 },
  fallbackTitle: { color: '#e8efdf', fontSize: 25, fontWeight: '700' },
  loadingTitle: { color: '#7f938c' },
  fallbackLabel: { color: '#d9f99d', fontSize: 24, fontWeight: '500', marginTop: 15 },
  score: { position: 'absolute', top: 10, right: 8, backgroundColor: '#101815', padding: 5, borderRadius: 5 },
  scoreText: { color: '#e8f2d9', fontSize: 24, fontWeight: '700' },
  caption: { position: 'absolute', bottom: 0, padding: 12, backgroundColor: '#0b131b', width: '100%' },
  captionText: { color: '#fff', fontSize: 24, fontWeight: '500', letterSpacing: 2 },
  title: { color: '#f2f3ee', fontSize: 28, fontWeight: '600', marginTop: 12 },
  year: { color: '#96a29f', fontSize: 24, fontWeight: '500', marginTop: 5, marginBottom: 5 },
  tvScore: { fontSize: 12 },
  tvCaption: { padding: 8 },
  tvCaptionText: { fontSize: 11 },
  tvTitle: { fontSize: 16, marginTop: 8 },
  tvYear: { fontSize: 13 },
});
