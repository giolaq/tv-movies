import { useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Movie } from './movies';

type PosterState = 'loading' | 'loaded' | 'failed';

export function MovieCard({ movie, active, onFocus, cardRef }: {
  movie: Movie; active: boolean; onFocus: () => void;
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
      onFocus={onFocus} onPress={onFocus}
      style={[s.card, active && s.active]}>
      <View style={s.art}>
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
        <View style={s.score}><Text style={s.scoreText}>★ {movie.rating}</Text></View>
        <View style={s.caption}><Text style={s.captionText}>{movie.genre.toUpperCase()}</Text></View>
      </View>
      <Text numberOfLines={1} style={s.title}>{movie.title}</Text>
      <Text style={s.year}>{movie.year}  ·  {movie.genre}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  card: { width: 184, padding: 5, borderWidth: 2, borderColor: 'transparent', borderRadius: 12, margin: 7 },
  active: { borderColor: '#d9f99d', backgroundColor: '#222d26', transform: [{ scale: 1.025 }] },
  art: { height: 235, borderRadius: 7, overflow: 'hidden', backgroundColor: '#283c38' },
  image: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  fallback: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', padding: 20, paddingBottom: 50 },
  fallbackTitle: { color: '#e8efdf', fontSize: 25, fontWeight: '700' },
  loadingTitle: { color: '#7f938c' },
  fallbackLabel: { color: '#d9f99d', fontSize: 9, letterSpacing: 1, marginTop: 15 },
  score: { position: 'absolute', top: 10, right: 8, backgroundColor: '#101815dd', padding: 5, borderRadius: 5 },
  scoreText: { color: '#e8f2d9', fontSize: 11, fontWeight: '700' },
  caption: { position: 'absolute', bottom: 0, padding: 12, backgroundColor: '#0b131bd9', width: '100%' },
  captionText: { color: '#fff', fontSize: 9, letterSpacing: 2 },
  title: { color: '#f2f3ee', fontSize: 14, fontWeight: '600', marginTop: 12 },
  year: { color: '#96a29f', fontSize: 11, marginTop: 5, marginBottom: 5 },
});
