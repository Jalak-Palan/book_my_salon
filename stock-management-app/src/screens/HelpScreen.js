import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Linking, Alert } from 'react-native';
import { useTheme, Button, Divider } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CustomInput } from '../components/CustomInput';
import { CustomCard } from '../components/CustomCard';
import { SectionHeader } from '../components/SectionHeader';

export default function HelpScreen() {
  const theme = useTheme();

  // FAQ Expanded indices
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Feedback fields
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');

  const faqs = [
    {
      q: 'How do I add or replenish product stock?',
      a: 'Go to the Purchases tab, click the "+" Floating button, select the product, supplier, and enter the purchase price and quantity. Upon confirmation, the product\'s stock will automatically increment.',
    },
    {
      q: 'How are product sales recorded?',
      a: 'Navigate to the Sales tab and add a new transaction. Enter the customer, product, and sold quantity. If stock is available, the product quantity decreases and a beautiful invoice is instantly generated.',
    },
    {
      q: 'Can I change the active currency symbol?',
      a: 'Yes, navigate to Settings base currency, and choose between US Dollars ($), Indian Rupees (₹), or Euros (€). The application updates all prices throughout the dashboard immediately.',
    },
    {
      q: 'Is my stock data stored securely?',
      a: 'Absolutely! Since this is a frontend-only demonstration app, your stock information is stored directly on your local device container cache (AsyncStorage) and never uploaded to any remote server.',
    },
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleCall = () => {
    Linking.openURL('tel:+18005550199').catch(() => {});
  };

  const handleMail = () => {
    Linking.openURL('mailto:support@stockify.com').catch(() => {});
  };

  const submitFeedback = () => {
    if (!feedbackMsg.trim()) {
      Alert.alert('Validation Error', 'Feedback message field cannot be empty.');
      return;
    }
    Alert.alert(
      'Feedback Received',
      'Thank you for your valuable feedback! We appreciate your suggestions.',
      [
        {
          text: 'OK',
          onPress: () => {
            setFeedbackMsg('');
            setFeedbackEmail('');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
      {/* FAQ Header */}
      <SectionHeader title="Frequently Asked Questions" />

      {faqs.map((item, idx) => {
        const isExpanded = expandedFaq === idx;
        return (
          <CustomCard key={idx} style={styles.faqCard} outline>
            <Pressable onPress={() => toggleFaq(idx)} style={styles.faqHeader}>
              <Text style={[styles.faqQuestion, { color: theme.colors.onSurface }]} numberOfLines={2}>
                {item.q}
              </Text>
              <MaterialCommunityIcons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={theme.colors.primary}
              />
            </Pressable>
            {isExpanded && (
              <View style={styles.faqAnswerContainer}>
                <Divider style={{ marginVertical: 8 }} />
                <Text style={[styles.faqAnswer, { color: theme.colors.onSurfaceVariant }]}>{item.a}</Text>
              </View>
            )}
          </CustomCard>
        );
      })}

      {/* Support Center */}
      <SectionHeader title="Contact Support Center" />
      <CustomCard style={styles.supportCard}>
        <Text style={[styles.supportSub, { color: theme.colors.onSurfaceVariant }]}>
          Our support desk is operational 24/7. Reach out to resolve stock-management queries:
        </Text>
        <View style={styles.supportButtons}>
          <Button mode="outlined" icon="phone" onPress={handleCall} style={styles.supportBtn}>
            Call Toll-Free
          </Button>
          <Button mode="contained" icon="email-outline" onPress={handleMail} style={styles.supportBtn}>
            Email Support
          </Button>
        </View>
      </CustomCard>

      {/* Feedback Section */}
      <SectionHeader title="Submit Feedback" />
      <CustomCard style={styles.feedbackCard}>
        <CustomInput
          label="Your Email (Optional)"
          value={feedbackEmail}
          onChangeText={setFeedbackEmail}
          leftIcon="email-outline"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <CustomInput
          label="Feedback Message *"
          value={feedbackMsg}
          onChangeText={setFeedbackMsg}
          leftIcon="message-draw"
          multiline
          numberOfLines={4}
          placeholder="Tell us what you think or report issues..."
        />
        <Button mode="contained" onPress={submitFeedback} style={styles.submitBtn}>
          Send Feedback
        </Button>
      </CustomCard>

      {/* App Version Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant + '80' }]}>Stockify Enterprise Suite</Text>
        <Text style={[styles.versionText, { color: theme.colors.onSurfaceVariant + '50' }]}>v1.0.0 (Production Build)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  faqCard: {
    marginVertical: 4,
    paddingVertical: 10,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    paddingRight: 10,
  },
  faqAnswerContainer: {
    marginTop: 4,
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 18,
  },
  supportCard: {
    marginVertical: 4,
  },
  supportSub: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  supportButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  supportBtn: {
    flex: 1,
    marginHorizontal: 4,
  },
  feedbackCard: {
    marginVertical: 4,
    paddingBottom: 16,
  },
  submitBtn: {
    marginTop: 12,
  },
  footer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  footerText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  versionText: {
    fontSize: 10,
    marginTop: 4,
  },
});
