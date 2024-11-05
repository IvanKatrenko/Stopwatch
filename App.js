

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const App = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Запуск и остановка таймера
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Сброс таймера
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };

  // Отслеживаем изменение таймера
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  // Форматирование времени 
  const formatTime = (sec) => {
    const minutes = String(Math.floor(sec / 60)).padStart(2, '0');
    const seconds = String(sec % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(seconds)}</Text>

      <TouchableOpacity onPress={toggleTimer} style={styles.button}>
        <Text style={styles.buttonText}>{isActive ? 'Пауза' : 'Старт'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={resetTimer} style={[styles.button, styles.resetButton]}>
        <Text style={styles.buttonText}>Сброс</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
  },
  timerText: {
    fontSize: 46,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    width: 150,
    padding: 15,
    backgroundColor: '#00796b',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
  },
  resetButton: {
    backgroundColor: '#d32f2f',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default App;
