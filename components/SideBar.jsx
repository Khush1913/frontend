import {
  StyleSheet, Text, View, TouchableOpacity,
  Animated, ScrollView, StatusBar
} from 'react-native'
import React, { useContext, useState, useRef } from 'react'
import uuid from 'react-native-uuid'
import { ChatIDContext, HistoryChatClicked } from '../context.js'
import ChatContext from '../context.js'

const NAV_MAIN   = ['Home', 'RAG', 'NewChat', 'History', 'Quickstart', 'Upload']
const NAV_BOTTOM = ['Login', 'Profile']

const SideBar = ({ Navigation }) => {
  const [active, setActive]       = useState('RAG')
  const [collapsed, setCollapsed] = useState(false)
  const animWidth = useRef(new Animated.Value(185)).current

  const { currentRouteName, navigation, SidebarState } = Navigation
  const [sidebar, setSideBar] = SidebarState
  const { setChatID }            = useContext(ChatIDContext)
  const { setChat }              = useContext(ChatContext)
  const { setHistoryChatClick }  = useContext(HistoryChatClicked)

  const toggleCollapse = () => {
    Animated.spring(animWidth, {
      toValue: collapsed ? 185 : 58,
      useNativeDriver: false,
      speed: 20, bounciness: 4,
    }).start()
    setCollapsed(c => !c)
  }

  const addMessage = () =>
    setChat(prev => {
      const id = uuid.v4()
      setChatID(id)
      return [...prev, { id, date: new Date().toISOString(), content: [] }]
    })

  const handlePress = item => {
    setActive(item)
    currentRouteName === item ? navigation.push(item) : navigation.navigate(item)
    if (item === 'RAG' || item === 'NewChat') addMessage()
    if (item === 'History') setHistoryChatClick(false)
  }

  const NavItem = ({ item }) => {
    const isActive = active === item
    return (
      <TouchableOpacity
        style={[styles.navItem, isActive && styles.navItemActive]}
        onPress={() => handlePress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.dot, isActive && styles.dotActive]} />
        {!collapsed && (
          <Text style={[styles.label, isActive && styles.labelActive]}>
            {item}
          </Text>
        )}
        {!collapsed && item === 'RAG' && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  if (!sidebar) return null

  return (
    <Animated.View style={[styles.container, { width: animWidth }]}>

      {/* Glass tint — no external package */}
      <View style={styles.glassBase} />
      <View style={styles.glassSheen} pointerEvents="none" />

      {/* Top border accent */}
      <View style={styles.topAccent} />

      {/* Collapse toggle */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.collapseBtn} onPress={toggleCollapse}>
          <Text style={styles.collapseBtnText}>{collapsed ? '›' : '‹'}</Text>
        </TouchableOpacity>
      </View>

      {/* Main nav */}
      <ScrollView
        style={styles.nav}
        contentContainerStyle={styles.navContent}
        showsVerticalScrollIndicator={false}
      >
        {NAV_MAIN.map(item => <NavItem key={item} item={item} />)}
      </ScrollView>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        {NAV_BOTTOM.map(item => <NavItem key={item} item={item} />)}
      </View>

      {/* Close tab */}
      <TouchableOpacity style={styles.closeTab} onPress={() => setSideBar(false)}>
        <Text style={styles.closeTabText}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default SideBar

const PURPLE      = 'rgba(108,99,255,0.22)'
const PURPLE_BORDER = 'rgba(108,99,255,0.45)'
const PURPLE_DOT  = '#a78bfa'
const WHITE_DIM   = 'rgba(255,255,255,0.55)'
const WHITE_BRIGHT= '#e2d9ff'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0,
    zIndex: 100,
    overflow: 'hidden',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.08)',
  },

  /* layered fake-glass background */
  glassBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,14,30,0.82)',
  },
  glassSheen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  /* thin purple line at very top */
  topAccent: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 2,
    backgroundColor: '#6c63ff',
    opacity: 0.7,
  },

  topRow: {
    paddingTop: (StatusBar.currentHeight ?? 44) + 8,
    paddingHorizontal: 10,
    paddingBottom: 10,
    alignItems: 'flex-start',
  },
  collapseBtn: {
    width: 30, height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collapseBtnText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 18, fontWeight: '700', lineHeight: 21,
  },

  nav: { flex: 1 },
  navContent: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 3,
  },
  navItemActive: {
    backgroundColor: PURPLE,
    borderColor: PURPLE_BORDER,
  },

  dot: {
    width: 6, height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  dotActive: {
    backgroundColor: PURPLE_DOT,
    shadowColor: PURPLE_DOT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 4,
  },

  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: WHITE_DIM,
    letterSpacing: 0.15,
  },
  labelActive: {
    color: WHITE_BRIGHT,
    fontWeight: '600',
  },

  badge: {
    backgroundColor: 'rgba(108,99,255,0.55)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeText: {
    color: '#e2d9ff',
    fontSize: 10,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    marginHorizontal: 14,
    marginVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },

  bottomNav: {
    paddingHorizontal: 10,
    paddingBottom: 28,
    gap: 2,
  },

  closeTab: {
    position: 'absolute',
    top: (StatusBar.currentHeight ?? 44) + 8,
    right: -14,
    width: 28, height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(10,14,30,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeTabText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
    fontWeight: '700',
  },
})