import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BottomSheet } from '../../common/BottomSheet';
import { COLORS } from '../../../constants/colors';
import { useAuthStore } from '../../../store/authStore';
import DateTimePicker from '@react-native-community/datetimepicker';

interface UpdateRelationshipSheetProps {
  visible: boolean;
  onClose: () => void;
}

const RELATIONSHIP_STATUS_OPTIONS = [
  { label: 'Dating', value: 'dating', icon: 'favorite' },
  { label: 'Engaged', value: 'engaged', icon: 'diamond' },
  { label: 'Married', value: 'married', icon: 'church' }, // Using 'church' as placeholder, maybe 'family-restroom' or similar
  { label: 'Other', value: 'other', icon: 'more-horiz' },
];

const LIVING_STYLE_OPTIONS = [
  { label: 'Long Distance', value: 'long_distance', icon: 'flight' },
  { label: 'Same City', value: 'same_city', icon: 'location-city' },
  { label: 'Living Together', value: 'living_together', icon: 'home' },
];

export const UpdateRelationshipSheet: React.FC<
  UpdateRelationshipSheetProps
> = ({ visible, onClose }) => {
  const { user, updateUser } = useAuthStore();

  const [status, setStatus] = useState(user?.relationshipStatus || 'dating');
  const [livingStyle, setLivingStyle] = useState(
    user?.livingStyle || 'same_city',
  );
  const [anniversary, setAnniversary] = useState<Date | null>(
    user?.anniversary ? new Date(user.anniversary) : null,
  );
  const [expandedSection, setExpandedSection] = useState<
    'status' | 'living' | null
  >(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    if (visible && user) {
      setStatus(user.relationshipStatus || 'dating');
      setLivingStyle(user.livingStyle || 'same_city');
      setAnniversary(user.anniversary ? new Date(user.anniversary) : null);
      setExpandedSection(null);
    }
  }, [visible, user]);

  const showToast = (
    message: string,
    type: 'success' | 'error' = 'success',
  ) => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateUser({
        relationshipStatus: status,
        livingStyle,
        anniversary: anniversary || undefined,
      });
      showToast('Relationship details updated!', 'success');
      setTimeout(onClose, 1500);
    } catch (error) {
      console.error('Update relationship error:', error);
      showToast('Failed to update details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: 'status' | 'living') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const CollapsibleSelector = ({
    sectionKey,
    label,
    options,
    value,
    onChange,
  }: {
    sectionKey: 'status' | 'living';
    label: string;
    options: typeof RELATIONSHIP_STATUS_OPTIONS;
    value: string;
    onChange: (val: string) => void;
  }) => {
    const isExpanded = expandedSection === sectionKey;
    const selectedOption = options.find(o => o.value === value);

    return (
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => toggleSection(sectionKey)}
          activeOpacity={0.7}
        >
          <View style={styles.headerInfo}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.selectedValue}>{selectedOption?.label}</Text>
          </View>
          <Icon
            name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={24}
            color={COLORS.zinc400}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.optionsContainer}>
            {options.map(option => {
              const isSelected = value === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                  onPress={() => {
                    onChange(option.value);
                    setExpandedSection(null);
                  }}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={option.icon}
                    size={20}
                    color={isSelected ? COLORS.white : COLORS.zinc400}
                  />
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkIcon}>
                      <Icon name="check" size={16} color={COLORS.white} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Relationship Info">
      <View style={styles.container}>
        {/* Custom Toast */}
        {toast.visible && (
          <View
            style={[styles.toast, toast.type === 'error' && styles.toastError]}
          >
            <Icon
              name={toast.type === 'success' ? 'check-circle' : 'error'}
              size={20}
              color={COLORS.white}
            />
            <Text style={styles.toastText}>{toast.message}</Text>
          </View>
        )}

        <CollapsibleSelector
          sectionKey="status"
          label="Relationship Status"
          options={RELATIONSHIP_STATUS_OPTIONS}
          value={status}
          onChange={setStatus}
        />

        <CollapsibleSelector
          sectionKey="living"
          label="Living Style"
          options={LIVING_STYLE_OPTIONS}
          value={livingStyle}
          onChange={setLivingStyle}
        />

        {/* Anniversary Picker */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => setShowDatePicker(true)}
          >
            <View style={styles.headerInfo}>
              <Text style={styles.label}>Anniversary Date</Text>
              <Text style={styles.selectedValue}>
                {anniversary
                  ? anniversary.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Select Date'}
              </Text>
            </View>
            <Icon name="edit" size={20} color={COLORS.zinc400} />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={anniversary || new Date()}
            mode="date"
            display="spinner"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setAnniversary(date);
            }}
            maximumDate={new Date()}
          />
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Update Relationship'}
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  section: {
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerInfo: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: COLORS.zinc400,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  selectedValue: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
  },
  optionsContainer: {
    padding: 12,
    paddingTop: 0,
    gap: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 12,
  },
  optionCardSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)', // Blue tint
    borderColor: COLORS.blue500,
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.zinc400,
    fontWeight: '500',
  },
  optionLabelSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  checkIcon: {
    backgroundColor: COLORS.blue500,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: COLORS.blue500,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  toast: {
    position: 'absolute',
    top: -60,
    left: 20,
    right: 20,
    backgroundColor: COLORS.green500,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 8,
  },
  toastError: {
    backgroundColor: COLORS.red500,
  },
  toastText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
