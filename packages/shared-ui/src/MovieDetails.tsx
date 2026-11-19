import { useEffect, useRef, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { Movie } from './movies';
import { formatRuntime } from './runtime';

export function MovieDetails({ movie, onClose }: { movie: Movie; onClose: () => void }) {
  const closeRef = useRef<View>(null);
  const [failed, setFailed] = useState(false);
  const [focused, setFocused] = useState(false);
  const { width, height } = useWindowDimensions();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (Platform.OS === 'web') (closeRef.current as unknown as HTMLElement | null)?.focus({ preventScroll: true });
      else (closeRef.current as (View & { requestTVFocus?: () => void }) | null)?.requestTVFocus?.();
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <View style={[s.root, { paddingHorizontal: width * 0.05, paddingVertical: height * 0.05 }]} accessibilityViewIsModal>
      <Text style={s.brand}>f.  FRAME / DETAILS</Text>
      <View style={s.layout}>
        {failed ? <View style={[s.poster, s.placeholder]}><Text style={s.title}>{movie.title}</Text></View>
          : <Image accessibilityLabel={movie.title + ' poster'} source={{ uri: movie.poster }} style={s.poster} resizeMode="cover" onError={() => setFailed(true)} />}
        <View style={s.copy}>
          <Text accessibilityRole="header" style={s.title}>{movie.title}</Text>
          <Text style={s.metadata}>★ {movie.rating}  ·  {movie.year}  ·  {formatRuntime(movie.runtime)}  ·  {movie.genre}</Text>
          <Text style={s.description}>{movie.description}</Text>
          <Pressable ref={closeRef} accessibilityRole="button" accessibilityLabel="Back to collection"
            hasTVPreferredFocus onPress={onClose} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={[s.back, focused && s.backFocused]}>
            <Text style={[s.backText, focused && { color: '#0d1518' }]}>← Back to collection</Text>
          </Pressable>
        </View>
      </View>
      <Text style={s.hint}>BACK / ESC / BACKSPACE  Return  ·  OK / ENTER  Back to collection</Text>
    </View>
  );
}
const s = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0d1518' },
  brand: { color: '#d9f99d', fontSize: 26, fontWeight: '800', letterSpacing: 2 },
  layout: { flex: 1, flexDirection: 'row', gap: 64, paddingVertical: 40 },
  poster: { width: '32%', height: '100%', borderRadius: 16, backgroundColor: '#283c38' },
  placeholder: { justifyContent: 'center', padding: 20 },
  copy: { flex: 1, justifyContent: 'center' },
  title: { color: '#f0f2e9', fontSize: 40, lineHeight: 48, fontWeight: '600' },
  metadata: { color: '#d4dfbf', fontSize: 22, lineHeight: 30, marginTop: 14 },
  description: { color: '#c2ceca', fontSize: 26, lineHeight: 36, marginTop: 14 },
  back: { alignSelf: 'flex-start', padding: 24, borderRadius: 12, borderWidth: 4, borderColor: 'transparent', backgroundColor: '#222d26', marginTop: 56 },
  backFocused: { borderColor: '#fff', backgroundColor: '#d9f99d' },
  backText: { color: '#f0f2e9', fontSize: 26, fontWeight: '700' },
  hint: { color: '#c2ceca', fontSize: 20, lineHeight: 28 },
});
