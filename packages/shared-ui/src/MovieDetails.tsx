import { useEffect, useRef, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Movie } from './movies';

export function MovieDetails({ movie, onClose }: { movie: Movie; onClose: () => void }) {
  const closeRef = useRef<View>(null);
  const [failed, setFailed] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (Platform.OS === 'web') (closeRef.current as unknown as HTMLElement | null)?.focus();
  }, []);
  return (
    <ScrollView contentContainerStyle={s.content}>
      <Pressable ref={closeRef} accessibilityRole="button" accessibilityLabel="Back to collection"
        hasTVPreferredFocus onPress={onClose} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={[s.back, focused && s.backFocused]}>
        <Text style={s.backText}>← Back to collection</Text>
      </Pressable>
      <View style={s.layout}>
        {failed ? <View style={[s.poster, s.placeholder]}><Text style={s.title}>{movie.title}</Text></View>
          : <Image accessibilityLabel={movie.title + ' poster'} source={{ uri: movie.poster }} style={s.poster} onError={() => setFailed(true)} />}
        <View style={s.copy}>
          <Text style={s.kicker}>FRAME ORIGINAL / MOVIE DETAILS</Text>
          <Text accessibilityRole="header" style={s.title}>{movie.title}</Text>
          <Text style={s.metadata}>★ {movie.rating}   ·   {movie.year}   ·   {movie.genre}</Text>
          <Text style={s.description}>{movie.description}</Text>
          <Text style={s.hint}>ESC / BACKSPACE / REMOTE BACK TO RETURN</Text>
        </View>
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  content: { padding: 40, flexGrow: 1 },
  back: { alignSelf: 'flex-start', padding: 14, borderRadius: 8, borderWidth: 2, borderColor: 'transparent', marginBottom: 25 },
  backFocused: { borderColor: '#d9f99d', backgroundColor: '#222d26' },
  backText: { color: '#d9f99d', fontSize: 14 },
  layout: { flexDirection: 'row', flexWrap: 'wrap', gap: 35, alignItems: 'center' },
  poster: { width: 280, height: 408, borderRadius: 12, backgroundColor: '#283c38' },
  placeholder: { justifyContent: 'center', padding: 20 },
  copy: { flex: 1, minWidth: 230 },
  kicker: { color: '#d9f99d', fontSize: 10, letterSpacing: 2, marginBottom: 22 },
  title: { color: '#f0f2e9', fontSize: 40, fontWeight: '600' },
  metadata: { color: '#d4dfbf', fontSize: 15, marginTop: 20 },
  description: { color: '#acb8b7', fontSize: 18, lineHeight: 29, marginTop: 25, maxWidth: 600 },
  hint: { color: '#879698', fontSize: 10, letterSpacing: 1, marginTop: 35 },
});
