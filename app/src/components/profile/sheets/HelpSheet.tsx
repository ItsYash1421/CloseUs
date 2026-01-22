import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BottomSheet } from '../../common/BottomSheet';
import { COLORS } from '../../../constants/colors';

interface HelpSheetProps {
    visible: boolean;
    onClose: () => void;
}

const FAQ_DATA = [
    {
        question: 'How do I connect with my partner?',
        answer: 'Go to the pairing screen and either share your unique code with your partner or enter their code to connect.',
    },
    {
        question: 'How do daily questions work?',
        answer: 'Every day, you and your partner get a new question to answer. Once both of you answer, you can see each other\'s responses!',
    },
    {
        question: 'Is my data private?',
        answer: 'Absolutely! Your messages and answers are encrypted and only visible to you and your partner.',
    },
    {
        question: 'How do I change my partner?',
        answer: 'Currently, you cannot change partners directly. Please contact support for assistance.',
    },
];

export const HelpSheet: React.FC<HelpSheetProps> = ({
    visible,
    onClose,
}) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const handleContactSupport = () => {
        Linking.openURL('mailto:closeus1421@gmail.com?subject=CloseUs Support Request');
    };

    const handleReportBug = () => {
        Linking.openURL('mailto:closeus1421@gmail.com?subject=Bug Report - CloseUs App');
    };

    const toggleFAQ = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <BottomSheet visible={visible} onClose={onClose} title="Help & Support" height={650}>
            <View style={styles.container}>
                {/* FAQ Section */}
                <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>
                <View style={styles.faqContainer}>
                    {FAQ_DATA.map((item, index) => (
                        <View key={index}>
                            <TouchableOpacity
                                style={styles.faqItem}
                                onPress={() => toggleFAQ(index)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.faqQuestion}>{item.question}</Text>
                                <Icon
                                    name={expandedIndex === index ? 'expand-less' : 'expand-more'}
                                    size={24}
                                    color={COLORS.zinc400}
                                />
                            </TouchableOpacity>
                            {expandedIndex === index && (
                                <View style={styles.faqAnswer}>
                                    <Text style={styles.answerText}>{item.answer}</Text>
                                </View>
                            )}
                            {index < FAQ_DATA.length - 1 && <View style={styles.faqDivider} />}
                        </View>
                    ))}
                </View>

                {/* Contact Options */}
                <Text style={styles.sectionTitle}>NEED MORE HELP?</Text>
                <View style={styles.contactContainer}>
                    <TouchableOpacity
                        style={styles.contactButton}
                        onPress={handleContactSupport}
                        activeOpacity={0.8}
                    >
                        <View style={styles.contactIcon}>
                            <Icon name="email" size={24} color={COLORS.blue400} />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactTitle}>Contact Support</Text>
                            <Text style={styles.contactDescription}>
                                We usually reply within 24 hours
                            </Text>
                        </View>
                        <Icon name="chevron-right" size={24} color={COLORS.zinc400} />
                    </TouchableOpacity>

                    <View style={styles.contactDivider} />

                    <TouchableOpacity
                        style={styles.contactButton}
                        onPress={handleReportBug}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.contactIcon, styles.bugIcon]}>
                            <Icon name="bug-report" size={24} color={COLORS.warning} />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactTitle}>Report a Bug</Text>
                            <Text style={styles.contactDescription}>
                                Help us improve the app
                            </Text>
                        </View>
                        <Icon name="chevron-right" size={24} color={COLORS.zinc400} />
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.zinc400,
        letterSpacing: 1,
        marginBottom: 12,
        marginTop: 8,
    },
    faqContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 24,
    },
    faqItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    faqQuestion: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.white,
        marginRight: 12,
    },
    faqAnswer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    answerText: {
        fontSize: 14,
        color: COLORS.zinc400,
        lineHeight: 20,
    },
    faqDivider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    contactContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    contactIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(96, 165, 250, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bugIcon: {
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
    },
    contactInfo: {
        flex: 1,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.white,
        marginBottom: 2,
    },
    contactDescription: {
        fontSize: 13,
        color: COLORS.zinc400,
    },
    contactDivider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginLeft: 72,
    },
});
