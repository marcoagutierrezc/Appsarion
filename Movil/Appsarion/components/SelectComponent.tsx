import React, { memo, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';

interface SelectProps {
  label: string;
  placeholder: string;
  value: string;
  options: { [key: string]: any }[];
  objValue: string;
  objLabel: string;
  onValueChange: (value: string) => void;
  error?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  colorTouchable?: string;
  colorPlaceholder?: string;
}

const Touchable: React.FC<{
  label: string;
  placeholder: string;
  onPress: () => void;
  selected: any;
  error?: string;
  isDisabled?: boolean;
  colorTouchable?: string;
  colorPlaceholder?: string;
}> = memo(({ label, placeholder, onPress, selected, error, isDisabled, colorTouchable, colorPlaceholder }) => (
  <View style={{ marginBottom: 10 }}>
    {label ? (
      <Text style={styles.label}>
        {label}
      </Text>
    ) : null}
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.touchable, { backgroundColor: colorTouchable || '#ddd' }]}
    >
      <Text style={{ color: selected ? '#000' : colorPlaceholder || '#888' }}>
        {selected ? selected.label : placeholder}
      </Text>
    </TouchableOpacity>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
));

const Option: React.FC<{ item: any; onSelect: (item: any) => void }> = memo(({ item, onSelect }) => (
  <TouchableOpacity onPress={() => onSelect(item)} style={styles.option}>
    <Text>{item.label}</Text>
  </TouchableOpacity>
));

const Select: React.FC<SelectProps> = ({
  label,
  placeholder,
  value,
  options,
  objValue,
  objLabel,
  onValueChange,
  error = '',
  isRequired = false,
  isDisabled = false,
  colorTouchable = '#ddd',
  colorPlaceholder = '#888',
}) => {
  const [selected, setSelected] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (value && options.length) {
      const item = options.find(item => String(item[objValue]) === value);
      if (item) {
        setSelected({ label: item[objLabel], value: item[objValue] });
      } else {
        setSelected(null);
      }
    } else {
      setSelected(null);
    }
  }, [value, options, objLabel, objValue]);

  const handleSelect = (item: any) => {
    setSelected({ label: item.label, value: item.value });
    onValueChange(item ? String(item.value) : '');
    setIsVisible(false);
  };

  return (
    <View>
      <Touchable
        label={`${label}${isRequired ? ' *' : ''}`}
        placeholder={placeholder}
        onPress={() => setIsVisible(true)}
        selected={selected}
        error={error}
        isDisabled={isDisabled}
        colorTouchable={colorTouchable}
        colorPlaceholder={colorPlaceholder}
      />

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={options.map(opt => ({ label: opt[objLabel], value: opt[objValue] }))}
                keyExtractor={(item) => String(item.value)}
                renderItem={({ item }) => (
                  <Option item={item} onSelect={handleSelect} />
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  touchable: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 10,
    maxHeight: '70%',
  },
});

export default memo(Select);