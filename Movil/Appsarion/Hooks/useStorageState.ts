import AsyncStorage from '@react-native-async-storage/async-storage';
import { useReducer, useEffect, useCallback } from 'react';

type State<T> = [boolean, T | null];
type UseStateHook<T> = [State<T>, (value: T | null) => void];

// Custom hook to manage async state
function useAsyncState<T>(initialValue: State<T> = [true, null]): UseStateHook<T> {
    const reducer = (state: State<T>, action: T | null = null): State<T> => [false, action];
    return useReducer(reducer, initialValue) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
    if (value == null) {
        await AsyncStorage.removeItem(key);
    } else {
        await AsyncStorage.setItem(key, value);
    }
}

export function useStorageState(key: string): UseStateHook<string> {
  
    const [state, setState] = useAsyncState<string>();

    // Get
    useEffect(() => {
        const loadValue = async () => {
            const value = await AsyncStorage.getItem(key);
            setState(value);
        };
        loadValue();
    }, [key]);

    // Set
    const setValue = useCallback(
        (value: string | null) => {
            setState(value);
            setStorageItemAsync(key, value);
        },
        [key]
    );

  return [state, setValue];
}