import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Switch, TextInput, Alert } from 'react-native';

const App = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(60);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [autoRestart, setAutoRestart] = useState(false);
  const [notificationInterval, setNotificationInterval] = useState(300);
  const [theme, setTheme] = useState('light');
  const [lastNotification, setLastNotification] = useState(0);

  const progress1 = useRef(new Animated.Value(0)).current;
  const progress2 = useRef(new Animated.Value(0)).current;
  const progress3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const dateTimeInterval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(dateTimeInterval);
  }, []);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

      Animated.parallel([
        Animated.timing(progress1, {
          toValue: 1,
          duration: duration * 1000,
          useNativeDriver: false,
        }),
        Animated.timing(progress2, {
          toValue: 1,
          duration: (duration * 1000) / 2,
          useNativeDriver: false,
        }),
        Animated.timing(progress3, {
          toValue: 1,
          duration: (duration * 1000) * 1.5,
          useNativeDriver: false,
        }),
      ]).start();

      return () => clearInterval(interval);
    }
  }, [isActive]);

  useEffect(() => {
    if (seconds >= duration) {
      setIsActive(false);
      setSeconds(0);
      progress1.setValue(0);
      progress2.setValue(0);
      progress3.setValue(0);

      if (autoRestart) {
        setTimeout(() => setIsActive(true), 1000);
      } else {
        alert("Таймер завершен!");
      }
    }

    if (seconds > 0 && seconds % notificationInterval === 0 && seconds !== lastNotification) {
      Alert.alert("Напоминание", `Прошло ${Math.floor(seconds / 60)} минут!`);
      setLastNotification(seconds);
    }
  }, [seconds, duration, autoRestart, notificationInterval, lastNotification]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive) setSeconds(0);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    setLastNotification(0);
    progress1.setValue(0);
    progress2.setValue(0);
    progress3.setValue(0);
  };

  const toggleAutoRestart = () => {
    setAutoRestart(!autoRestart);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const animatedRadius1 = progress1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const animatedRadius2 = progress2.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const animatedRadius3 = progress3.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const formatDateTime = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  };

  const themeStyles = theme === 'light' ? lightStyles : darkStyles;

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={themeStyles.dateTimeText}>{formatDateTime(currentDateTime)}</Text>

      <View style={styles.timerContainer}>
        <Animated.View
          style={[
            styles.progressCircle,
            {
              transform: [{ rotate: animatedRadius1 }],
              borderColor: '#ff9800',
              borderWidth: 8,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.progressCircle,
            {
              transform: [{ rotate: animatedRadius2 }],
              borderColor: '#f44336',
              borderWidth: 6,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.progressCircle,
            {
              transform: [{ rotate: animatedRadius3 }],
              borderColor: '#4caf50',
              borderWidth: 4,
            },
          ]}
        />
        <Text style={themeStyles.timerText}>{formatTime(seconds)}</Text>
      </View>

      <TextInput
        style={themeStyles.input}
        keyboardType="numeric"
        placeholder="Интервал уведомления (сек)"
        onChangeText={(text) => setNotificationInterval(Number(text))}
        placeholderTextColor={theme === 'light' ? '#555' : '#aaa'}
      />

      <TouchableOpacity onPress={toggleTimer} style={themeStyles.button}>
        <Text style={themeStyles.buttonText}>{isActive ? 'Пауза' : 'Старт'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={resetTimer} style={[themeStyles.button, styles.resetButton]}>
        <Text style={themeStyles.buttonText}>Сброс</Text>
      </TouchableOpacity>

      <View style={styles.switchContainer}>
        <Text style={themeStyles.switchText}>Автозапуск:</Text>
        <Switch value={autoRestart} onValueChange={toggleAutoRestart} />
      </View>

      <View style={styles.switchContainer}>
        <Text style={themeStyles.switchText}>Темная тема:</Text>
        <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
      </View>
    </View>
  );
};

const formatTime = (sec) => {
  const minutes = String(Math.floor(sec / 60)).padStart(2, '0');
  const seconds = String(sec % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    position: 'absolute',
  },
  input: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  resetButton: {
    backgroundColor: '#d32f2f',
  },
});

// Светлая тема
const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: '#e0f7fa',
  },
  dateTimeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#555',
  },
  timerText: {
    fontSize: 36,
    color: '#00796b',
    fontWeight: 'bold',
  },
  button: {
    width: 150,
    padding: 15,
    backgroundColor: '#00796b',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  switchText: {
    fontSize: 16,
    marginRight: 10,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    color: '#000',
  },
});

// Темная тема
const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#212121',
  },
  dateTimeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ccc',
  },
  timerText: {
    fontSize: 36,
    color: '#80cbc4',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  button: {
    width: 150,
    padding: 15,
    backgroundColor: '#004d40',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
  },
  resetButton: {
    backgroundColor: '#b71c1c',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  switchText: {
    fontSize: 16,
    marginRight: 10,
    color: '#ccc',
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
  },
});

export default App;
