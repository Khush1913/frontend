import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ScrollView, StatusBar, ActivityIndicator
} from 'react-native';
import {
  launchImageLibrary as _launchImageLibrary,
  launchCamera as _launchCamera
} from 'react-native-image-picker';

const launchImageLibrary = _launchImageLibrary;
const launchCamera = _launchCamera;

const Upload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [outputImage,   setOutputImage]   = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);

  const openImagePicker = () => {
    launchImageLibrary(
      { mediaType: 'photo', includeBase64: false, maxHeight: 2000, maxWidth: 2000 },
      handleResponse
    );
  };

  const handleCameraLaunch = () => {
    launchCamera(
      { mediaType: 'photo', includeBase64: false, maxHeight: 2000, maxWidth: 2000 },
      handleResponse
    );
  };

  const handleResponse = async (response) => {
    if (response.didCancel) return;
    if (response.errorCode) { setError(response.errorMessage); return; }

    const imageUri = response.uri || response.assets?.[0]?.uri;
    setSelectedImage(imageUri);
    setOutputImage(null);
    setError(null);
    setLoading(true);

    try {
      const data = new FormData();
      data.append('file', { uri: imageUri, name: 'input.jpg', type: 'image/jpeg' });

      const res  = await fetch('https://medi-backend-oqaa.onrender.com/fractureDetection', {
        method: 'POST', body: data,
      });
      const json = await res.json();
      setOutputImage(`data:image/jpeg;base64,${json.output_image}`);
    } catch (e) {
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setOutputImage(null);
    setError(null);
    setLoading(false);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bgBase} />
      <View style={styles.bgSheen} />
      <View style={styles.topAccent} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Fracture Detection</Text>
          <Text style={styles.subtitle}>Upload or capture an X-ray image for AI analysis</Text>
        </View>

        {/* Image Preview Area */}
        <View style={styles.previewCard}>
          {loading ? (
            <View style={styles.previewPlaceholder}>
              <ActivityIndicator size="large" color="#a78bfa" />
              <Text style={styles.placeholderText}>Analysing image…</Text>
            </View>
          ) : outputImage ? (
            <>
              <Image
                source={{ uri: outputImage }}
                style={styles.previewImage}
                resizeMode="contain"
              />
              <View style={styles.resultBadge}>
                <View style={styles.resultDot} />
                <Text style={styles.resultBadgeText}>Analysis complete</Text>
              </View>
            </>
          ) : selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.previewPlaceholder}>
              <Text style={styles.placeholderIcon}>🩻</Text>
              <Text style={styles.placeholderTitle}>No image selected</Text>
              <Text style={styles.placeholderText}>
                Choose from your gallery or take a photo
              </Text>
            </View>
          )}
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Status row */}
        {selectedImage && !loading && (
          <View style={styles.statusRow}>
            <View style={styles.statusChip}>
              <View style={[styles.chipDot, { backgroundColor: '#34c7a0' }]} />
              <Text style={styles.chipText}>Image loaded</Text>
            </View>
            {outputImage && (
              <View style={styles.statusChip}>
                <View style={[styles.chipDot, { backgroundColor: '#a78bfa' }]} />
                <Text style={styles.chipText}>Result ready</Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btnPrimary} onPress={openImagePicker} activeOpacity={0.8}>
            <Text style={styles.btnIcon}>🖼️</Text>
            <Text style={styles.btnText}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnSecondary} onPress={handleCameraLaunch} activeOpacity={0.8}>
            <Text style={styles.btnIcon}>📷</Text>
            <Text style={styles.btnText}>Camera</Text>
          </TouchableOpacity>
        </View>

        {selectedImage && (
          <TouchableOpacity style={styles.btnReset} onPress={reset} activeOpacity={0.7}>
            <Text style={styles.btnResetText}>✕  Clear & Reset</Text>
          </TouchableOpacity>
        )}

        {/* Info cards */}
        <View style={styles.infoRow}>
          {[
            { icon: '🔒', text: 'Secure upload' },
            { icon: '⚡', text: 'Instant AI result' },
            { icon: '🩺', text: 'Clinical-grade' },
          ].map((item, i) => (
            <View key={i} style={styles.infoCard}>
              <Text style={styles.infoIcon}>{item.icon}</Text>
              <Text style={styles.infoText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

export default Upload;

const PURPLE      = '#6c63ff';
const WHITE_DIM   = 'rgba(255,255,255,0.50)';
const WHITE_MID   = 'rgba(255,255,255,0.75)';
const WHITE_BRIGHT= '#e2d9ff';
const BORDER      = 'rgba(255,255,255,0.08)';

const styles = StyleSheet.create({
  root: { flex: 1 },
  bgBase:  { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,14,30,0.97)' },
  bgSheen: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(108,99,255,0.04)' },
  topAccent: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 2, backgroundColor: PURPLE, opacity: 0.7, zIndex: 10,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 60 },

  header: { marginBottom: 22 },
  title: {
    fontSize: 24, fontWeight: '700',
    color: WHITE_BRIGHT, letterSpacing: 0.2, marginBottom: 6,
  },
  subtitle: { fontSize: 13, color: WHITE_DIM, lineHeight: 19 },

  /* Preview */
  previewCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 280,
    marginBottom: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: { width: '100%', height: 300 },
  previewPlaceholder: {
    alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24,
  },
  placeholderIcon:  { fontSize: 48, marginBottom: 14 },
  placeholderTitle: { fontSize: 16, fontWeight: '600', color: WHITE_MID, marginBottom: 6 },
  placeholderText:  { fontSize: 13, color: WHITE_DIM, textAlign: 'center', lineHeight: 19 },

  resultBadge: {
    position: 'absolute', bottom: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(52,199,160,0.20)',
    borderWidth: 1, borderColor: 'rgba(52,199,160,0.40)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  resultDot:       { width: 7, height: 7, borderRadius: 4, backgroundColor: '#34c7a0' },
  resultBadgeText: { fontSize: 12, color: '#34c7a0', fontWeight: '600' },

  /* Error */
  errorCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,107,107,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,107,107,0.30)',
    borderRadius: 12, padding: 13, marginBottom: 14,
  },
  errorIcon: { fontSize: 16 },
  errorText: { flex: 1, fontSize: 13, color: '#ff6b6b', lineHeight: 18 },

  /* Status */
  statusRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statusChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
  },
  chipDot:  { width: 6, height: 6, borderRadius: 3 },
  chipText: { fontSize: 12, color: WHITE_MID, fontWeight: '500' },

  /* Buttons */
  btnRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  btnPrimary: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(108,99,255,0.22)',
    borderWidth: 1, borderColor: 'rgba(108,99,255,0.45)',
    borderRadius: 13, paddingVertical: 16,
  },
  btnSecondary: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(52,199,160,0.15)',
    borderWidth: 1, borderColor: 'rgba(52,199,160,0.35)',
    borderRadius: 13, paddingVertical: 16,
  },
  btnIcon: { fontSize: 18 },
  btnText: { fontSize: 15, fontWeight: '600', color: WHITE_BRIGHT },

  btnReset: {
    alignItems: 'center', paddingVertical: 12,
    borderWidth: 1, borderColor: 'rgba(255,107,107,0.25)',
    borderRadius: 12, marginBottom: 22,
    backgroundColor: 'rgba(255,107,107,0.08)',
  },
  btnResetText: { fontSize: 13, color: '#ff6b6b', fontWeight: '600' },

  /* Info row */
  infoRow: { flexDirection: 'row', gap: 10 },
  infoCard: {
    flex: 1, alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 12, paddingVertical: 14,
  },
  infoIcon: { fontSize: 20, marginBottom: 6 },
  infoText: { fontSize: 11, color: WHITE_DIM, textAlign: 'center', fontWeight: '500' },
});