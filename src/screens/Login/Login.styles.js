import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  gradient: {
    flex: 1,
  },

  safe: {
    flex: 1,
  },

  flex: {
    flex: 1,
  },

  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(15, 118, 110, 0.35)',
  },

  appBarLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },

  appBarTextWrap: {
    marginLeft: 12,
    flex: 1,
  },

  appBarTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  appBarSubtitle: {
    color: 'rgba(226, 232, 240, 0.78)',
    fontSize: 12,
    marginTop: 1,
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 36,
  },

  hero: {
    alignItems: 'center',
    marginBottom: 28,
  },

  heroLogo: {
    width: 88,
    height: 88,
    borderRadius: 22,
    marginBottom: 16,
  },

  brand: {
    color: '#5EEAD4',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },

  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.22)',
  },

  field: {
    marginBottom: 16,
  },

  label: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.2,
  },

  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.28)',
    borderRadius: 14,
    paddingHorizontal: 12,
    minHeight: 52,
  },

  inputShellFocused: {
    borderColor: '#14B8A6',
    backgroundColor: 'rgba(20, 184, 166, 0.08)',
  },

  inputIcon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 12,
  },

  eyeButton: {
    padding: 6,
    marginLeft: 4,
  },

  error: {
    color: '#FCA5A5',
    marginBottom: 14,
    fontSize: 14,
    textAlign: 'center',
  },

  footerText: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
  },
});
