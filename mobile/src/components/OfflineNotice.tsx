import { useNetInfo } from '@react-native-community/netinfo';
import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

const OfflineNotice = () => {
    const netInfo = useNetInfo();

    if (netInfo.type !== 'unknown' && netInfo.isInternetReachable === false) {
        return (
            <SafeAreaView style={styles.offlineContainer}>
                <View style={styles.offlineView}>
                    <Text style={styles.offlineText}>Sem ligação à Internet</Text>
                </View>
            </SafeAreaView>
        );
    }
    return null;
};

const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: '#b52424',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        width,
        zIndex: 1,
    },
    offlineView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    offlineText: {
        color: '#fff',
        fontSize: 12, // Reduced font size to fit in 30 height
        fontWeight: 'bold', // Added bold for better visibility
    }
});

export default OfflineNotice;
