import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import RBSheet from "react-native-raw-bottom-sheet";

import { commom } from '~/Themes';
import styles from "./ListTransactionScreenStyle";
import TransactionTab from '~/Containers/Transaction/ListTransaction/TransactionTab/TransactionTab';
import TransactionFilter from '~/Containers/Transaction/ListTransaction/TransactionFilter/TransactionFilter';

const renderScenes = SceneMap({
  all: () => <TransactionTab/>,
  recharge: () => <TransactionTab/>,
  pay: () => <TransactionTab/>
})

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={styles.indicatorStl}
    style={styles.tabBarStl}
    labelStyle={styles.labelStl}
    renderLabel={({ route, focused, color }) => (
      <Text style={styles.labelStl}>
        {route.title}
      </Text>
    )}
  />
)

class ListTransactionScreen extends Component {  
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { 
          key: 'all', 
          title: 'Tất cả' 
        },
        { 
          key: 'recharge', 
          title: 'Nạp tiền' 
        },
        { 
          key: 'pay', 
          title: 'Thanh toán' 
        }
      ],
      filter: {        
        isFiltering: false,
        query: {
          startDate: '',
          endDate: ''
        }
      }
    }
  }

  setFilter(newQuery) {
    let { filter } = this.state;
    let query = filter.query;
    query = Object.assign(query, newQuery);
    this.setState({
      filter: {
        ...filter,
        query
      }
    })
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerLeft: () =>  (
        <Button title="Filter" onPress={() => this.RBSheet.open()} />
      )
    })
  }

  resetSearch() {
    const { filter } = this.state;
    filter.isFiltering = false;    
    this.setState({filter});
    this.RBSheet.close();
  }

  search() {
    const { filter } = this.state;
    filter.isFiltering = true;    
    this.setState({filter});
    this.RBSheet.close();
  }

  render() {
    const { index, routes, filter } = this.state;
    const initialLayout = { 
      width: Dimensions.get('window').width 
    }

    return (
      // <SafeAreaView style={commom.safeArea}>
        <View style={[commom.container, commom.p0]}>
          <TabView          
            renderTabBar={renderTabBar}
            style={commom.flex_1}
            navigationState={{ index, routes }}
            renderScene={ renderScenes }
            onIndexChange={index => this.setState({index})}
            initialLayout={initialLayout}
            getLabelText={({ route }) => route.title}
          />          

          <RBSheet
            ref={ref => {
              this.RBSheet = ref;
            }}
            height={200}
            openDuration={250}
          >
            <TransactionFilter 
              option={filter}
              search={() => this.search()}
              reset={() => this.resetSearch()}
              setFilter={(query) => this.setFilter(query)}/>
          </RBSheet>
        </View>
      // </SafeAreaView>
    )
  }
}

export default ListTransactionScreen;