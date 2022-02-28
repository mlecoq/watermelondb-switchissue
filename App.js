/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import 'react-native-get-random-values';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  FlatList,
  Alert,
} from 'react-native';
import {TextInput} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import DatabaseProvider, {
  withDatabase,
} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import buildDb from './src/model';
import {useDatabase} from '@nozbe/watermelondb/hooks';

const TaskList = ({tasks}) => {
  return (
    <FlatList
      data={tasks}
      keyExtractor={task => task.id}
      renderItem={({item}) => <Text>{item.name}</Text>}
    />
  );
};

const TaskListWithData = withDatabase(
  withObservables([], ({database}) => ({
    tasks: database.collections.get('tasks').query(),
  }))(TaskList),
);

const TaskCreator = () => {
  const [taskName, setTaskName] = useState('');
  const database = useDatabase();

  return (
    <View flexDirection="row" width="100%" alignItems="center">
      <TextInput
        placehold="Database Name"
        onChangeText={setTaskName}
        value={taskName}
        flex={1}
        borderWidth={1}
        borderColor="grey"
      />
      <View marginLeft={6}>
        <Button
          title="Add"
          onPress={async () => {
            if (taskName.trim()) {
              const collection = database.collections.get('tasks');

              await database.write(async () => {
                await collection.create(data => {
                  data.name = taskName;
                });
              });
            } else {
              Alert.alert('Please enter task name');
            }
          }}
        />
      </View>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [databaseName, setDatabaseName] = useState('');

  const [currentDb, setCurrentDb] = useState(null);

  return (
    <SafeAreaView style={backgroundStyle} flex={1} padding={10}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View>
        <View flexDirection="row" width="100%" alignItems="center">
          <TextInput
            placehold="Database Name"
            onChangeText={setDatabaseName}
            value={databaseName}
            flex={1}
            borderWidth={1}
            borderColor="grey"
          />
          <View marginLeft={6}>
            <Button
              title={currentDb ? 'Switch' : 'Create'}
              onPress={() => {
                if (databaseName.trim()) {
                  setCurrentDb(buildDb(databaseName));
                }
              }}
            />
          </View>
        </View>
      </View>
      {currentDb ? (
        <DatabaseProvider database={currentDb}>
          <View flex={1}>
            <Text>
              Current Db: {currentDb.adapter.underlyingAdapter._dbName}
            </Text>
            <TaskCreator />
            <TaskListWithData />
          </View>
        </DatabaseProvider>
      ) : (
        <View>
          <Text>Please set db name</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
