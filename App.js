import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert, Linking } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  // state
  const [hasPermission, setHasPermission] = useState(null); // データフック：stateに値を連動
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      // BarCoderScannerから、権限
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      // 権限okの場合 → 'granted'と設定されている
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // jsのalter
    Alert.alert(
      `${data}`,
      'URLに移動しますか？',
      [
        {text: 'キャンセル', onPress: () => {}},
        {text: '確認', onPress: () => {Linking.openURL(`${data}`)}},
      ],
      { cancelable: false }
    )
  };

  if (hasPermission === null) {
    return <Text>カメラ権限を取得中です。許可してください。</Text>;
  }
  if (hasPermission === false) {
    return <Text>カメラの権限を許可してください。</Text>;
  }

  // 実際のrenderが行ってるところ
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {/* onpress：tabするときのPressEvent */}
      {!scanned && <Button color='#000000' title={'URLを「http」から書いてください。'} onPress={() => {}} />} 
      {scanned && <Button title={'再度クリックして、スキャンする。'} onPress={() => setScanned(false)} />}
    </View>
  );
}