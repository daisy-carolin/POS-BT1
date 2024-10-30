import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const SubscriptionPage = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    { id: 1, name: 'Basic Plan', price: '$10/month', features: ['Feature 1', 'Feature 2'] },
    { id: 2, name: 'Pro Plan', price: '$20/month', features: ['Feature 1', 'Feature 2', 'Feature 3'] },
    { id: 3, name: 'Enterprise Plan', price: '$50/month', features: ['All features included'] },
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    Alert.alert(`You selected the ${plan.name}`);
    // You can perform navigation or API request to confirm the subscription here.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Subscription Plan</Text>
      {plans.map((plan) => (
        <TouchableOpacity
          key={plan.id}
          style={[styles.planCard, selectedPlan?.id === plan.id ? styles.selectedCard : null]}
          onPress={() => handleSelectPlan(plan)}
        >
          <Text style={styles.planTitle}>{plan.name}</Text>
          <Text style={styles.planPrice}>{plan.price}</Text>
          <View style={styles.features}>
            {plan.features.map((feature, index) => (
              <Text key={index} style={styles.featureText}>
                - {feature}
              </Text>
            ))}
          </View>
        </TouchableOpacity>
      ))}

      {selectedPlan && (
        <TouchableOpacity style={styles.confirmButton} onPress={() => Alert.alert('Subscription Confirmed')}>
          <Text style={styles.confirmButtonText}>Confirm {selectedPlan.name}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  selectedCard: {
    borderColor: '#0F084B',
    borderWidth: 2,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  planPrice: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  features: {
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#0F084B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SubscriptionPage;
