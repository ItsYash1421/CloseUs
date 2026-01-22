import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BottomSheet } from '../../common/BottomSheet';
import { COLORS } from '../../../constants/colors';
// @ts-ignore - version comes from package.json
import { version } from '../../../../package.json';

interface AboutSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const AboutSheet: React.FC<AboutSheetProps> = ({ visible, onClose }) => {
  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };

  const LinkItem = ({
    icon,
    title,
    onPress,
  }: {
    icon: string;
    title: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={styles.linkItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.linkIcon}>
        <Icon name={icon} size={20} color={COLORS.blue400} />
      </View>
      <Text style={styles.linkText}>{title}</Text>
      <Icon name="chevron-right" size={24} color={COLORS.zinc400} />
    </TouchableOpacity>
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} title="About" height={600}>
      <View style={styles.container}>
        {/* App Info */}
        <View style={styles.appInfo}>
          <View style={styles.appIcon}>
            <Image
              source={require('../../../assets/images/CloseUs.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>CloseUs</Text>
          <Text style={styles.version}>Version {version || '1.0.0'}</Text>
          <Text style={styles.tagline}>
            Bringing couples closer, one moment at a time
          </Text>
        </View>

        {/* Links */}
        <View style={styles.links}>
          <LinkItem
            icon="description"
            title="Terms of Service"
            onPress={() => handleOpenLink('https://closeus.app/terms')}
          />
          <View style={styles.divider} />
          <LinkItem
            icon="privacy-tip"
            title="Privacy Policy"
            onPress={() => handleOpenLink('https://closeus.app/privacy')}
          />
          <View style={styles.divider} />
          <LinkItem
            icon="star"
            title="Rate Us"
            onPress={() =>
              handleOpenLink(
                'https://play.google.com/store/apps/details?id=com.closeus',
              )
            }
          />
          <View style={styles.divider} />
          <LinkItem
            icon="share"
            title="Share with Friends"
            onPress={() => {
              // TODO: Implement share functionality
            }}
          />
        </View>

        {/* Credits */}
        <View style={styles.credits}>
          <Text style={styles.creditsText}>
            Made with ❤️ for couples everywhere
          </Text>
          <Text style={styles.copyright}>
            © 2026 CloseUs. All rights reserved.
          </Text>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  appIcon: {
    width: 80,
    height: 80,
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: COLORS.zinc400,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.blue300,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  links: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.white,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 64,
  },
  credits: {
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 16,
  },
  creditsText: {
    fontSize: 14,
    color: COLORS.zinc400,
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    color: COLORS.zinc400,
  },
});
