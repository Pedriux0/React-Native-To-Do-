import React, { useState, useEffect } from 'react';
//StAuth10244: I Juan Naranjo 000895164 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  FlatList,
  Alert,
  ImageBackground
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

const COLORS = {
  // Cyberpunk core
  primary: '#33FF33',       // Electric cyan (main actions)
  primaryGlow: '#00F0FF80', // 50% opacity glow effect
  secondary: '#FF2A6D',     // Hot pink (secondary actions)
  tertiary: '#FFE81F',      // Cyber-yellow (highlights)
  
  // Status colors
  success: '#00FF87',       // Matrix green
  warning: '#FF9E00',       // Neon orange
  danger: '#FF003C',        // Hacker red
  info: '#6E44FF',          // Purple data streams
  
  // Dark theme base
  dark: '#0A0A12',          // Deep void black
  card: '#161622',          // Card bg (darker)
  interface: '#212133',     // UI elements
  
  // Neon accents
  accent1: '#FF2079',       // Pink neon
  accent2: '#00F0FF',       // Cyan neon
  accent3: '#E300FF',       // Purple neon
  
  // Text/UI
  textPrimary: '#FFFFFF',   // Bright white
  textSecondary: '#B0B0FF', // Soft blue text
  textMuted: '#6B6B8A',     // Disabled items
  
  // Gradients
  gradientCyber: ['#FF2A6D', '#00F0FF'], // Pink-to-cyan
  gradientMatrix: ['#00FF87', '#00F0FF']  // Green-to-cyan
};

const API_URL = "http://10.0.0.78:3001"; //local machine 

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/load`);
      setTodos(response.data);
    } catch (err) {
      Alert.alert("SYSTEM ERROR", "Failed to load data from mainframe");
      console.error("Load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTodos = async () => {
    try {
      await axios.post(`${API_URL}/save`, todos);
      Alert.alert("SYNC COMPLETE", "Data uploaded to neural network");
    } catch (err) {
      Alert.alert("CONNECTION FAILED", "Could not reach central database");
      console.error('Save error:', err);
    }
  };

  const clearTodos = async () => {
    try {
      await axios.get(`${API_URL}/clear`);
      setTodos([]);
      Alert.alert("SYSTEM PURGE", "All data wiped from memory banks");
    } catch (err) {
      Alert.alert("WIPE FAILED", "Could not erase data");
      console.error('Clear error:', err);
    }
  };

  const addTodo = () => {
    if (!text.trim()) {
      Alert.alert("INPUT ERROR", "Cannot process empty command");
      return;
    }

    if (editingId !== null) {
      const updatedTodos = [...todos];
      updatedTodos[editingId] = text;
      setTodos(updatedTodos);
      setEditingId(null);
    } else {
      setTodos([...todos, text]);
    }
    setText("");
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const editTodo = (index) => {
    setText(todos[index]);
    setEditingId(index);
  };

  return (

      <View style={styles.overlay}>
        {/* Header with cyberpunk styling */}
        <Text style={styles.header}>NEURAL TODO INTERFACE</Text>
        
        {/* Input Section with glow effect */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="ENTER DIRECTIVE..."
            placeholderTextColor={COLORS.textMuted}
            value={text}
            onChangeText={setText}
            onSubmitEditing={addTodo}
            selectionColor={COLORS.primary}
          />
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.addButton,
              { 
                backgroundColor: pressed ? COLORS.secondary : COLORS.primary,
                shadowColor: COLORS.primary,
                shadowRadius: pressed ? 10 : 15,
              }
            ]}
            onPress={addTodo}
          >
            <Text style={styles.buttonText}>
              {editingId !== null ? "OVERWRITE" : "EXECUTE"}
            </Text>
          </Pressable>
        </View>

        {/* Action Buttons with cyberpunk styling */}
        <View style={styles.actionRow}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.saveButton,
              { 
                backgroundColor: COLORS.info,
                shadowColor: COLORS.info,
                shadowRadius: pressed ? 10 : 15,
              }
            ]}
            onPress={saveTodos}
          >
            <Text style={styles.buttonText}>UPLOAD TO CLOUD</Text>
          </Pressable>
          
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.clearButton,
              { 
                backgroundColor: COLORS.danger,
                shadowColor: COLORS.danger,
                shadowRadius: pressed ? 10 : 15,
              }
            ]}
            onPress={clearTodos}
          >
            <Text style={styles.buttonText}>WIPE DATA</Text>
          </Pressable>
        </View>

        {/* Todo List with cyberpunk cards */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <MaterialIcons name="cloud-sync" size={50} color={COLORS.primary} />
            <Text style={styles.loadingText}>SYNCING WITH MAINFRAME...</Text>
          </View>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.todoItem}>
                <Text style={styles.todoText}>{item}</Text>
                <View style={styles.actions}>
                  <Pressable 
                    style={styles.iconButton}
                    onPress={() => editTodo(index)}
                  >
                    <MaterialIcons name="edit" size={24} color={COLORS.tertiary} />
                  </Pressable>
                  <Pressable 
                    style={styles.iconButton}
                    onPress={() => deleteTodo(index)}
                  >
                    <MaterialIcons name="delete" size={24} color={COLORS.danger} />
                  </Pressable>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>NO DIRECTIVES FOUND</Text>
            }
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 18, 0.85)',
    padding: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 25,
    textAlign: 'center',
    textShadowColor: COLORS.primaryGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.interface,
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'rgba(33, 33, 51, 0.7)',
    color: COLORS.textPrimary,
    fontFamily: 'monospace',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    elevation: 10,
  },
  addButton: {
    width: 100,
    flex: 0,
  },
  buttonText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(22, 22, 34, 0.8)',
    borderRadius: 5,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent1,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontFamily: 'monospace',
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textMuted,
    marginTop: 30,
    fontSize: 16,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.primary,
    fontSize: 16,
    marginTop: 20,
    textShadowColor: COLORS.primaryGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  listContent: {
    paddingBottom: 20,
  },
});