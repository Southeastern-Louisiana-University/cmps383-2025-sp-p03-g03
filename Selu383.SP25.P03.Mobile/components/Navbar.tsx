import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput,
  StyleSheet,
  Keyboard
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from "@/context/AuthContext";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const handleNavigateToLogin = () => {
    if(auth?.isAuthenticated){
      router.push('/(auth)/profile');
    } else {
      (router as any).navigate('/(auth)/login');
    } 
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
    Keyboard.dismiss();
  };

  const cancelSearch = () => {
    setSearchQuery('');
    setShowSearch(false);
    if (onSearch) {
      onSearch('');
    }
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      {/* App Title or Search Input */}
      <View style={styles.leftContainer}>
        {showSearch ? (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search movies..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              autoFocus={true}
            />
          </View>
        ) : (
          <Text style={styles.title}>Lion's Den</Text>
        )}
      </View>

      {/* Right Icons */}
      <View style={styles.rightContainer}>
        {showSearch ? (
          <TouchableOpacity onPress={cancelSearch}>
            <Icon name="times" size={20} color="white" style={styles.icon} />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity 
              onPress={() => setShowSearch(true)}
              style={styles.iconButton}
            >
              <Icon name="search" size={20} color="white" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="envelope" size={20} color="white" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleNavigateToLogin}
              style={styles.iconButton}
            >
              <Icon name="user" size={20} color="white" style={styles.icon} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'black',
    paddingHorizontal: 16,
    paddingVertical: 40,
    width: '100%',
  },
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    flex: 1,
  },
  searchInput: {
    height: 36,
    backgroundColor: '#222',
    borderRadius: 18,
    paddingHorizontal: 15,
    color: 'white',
    fontSize: 14,
  },
  iconButton: {
    marginLeft: 16,
  },
  icon: {
    width: 24,
    textAlign: 'center',
  },
});

export default Navbar;