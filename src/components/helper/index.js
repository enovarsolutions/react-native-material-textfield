import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, Animated } from 'react-native';

import styles from './styles';

type propTypes = {
  style: any,
  children: React.ReactNode,
};

export default class Helper extends PureComponent<propTypes> {
  static defaultProps = {
    numberOfLines: 1,
  };

  render() {
    let { children, style, ...props } = this.props;

    return (
      <View style={styles.container}>
        <Animated.Text style={[styles.text, style]} {...props}>
          {children}
        </Animated.Text>
      </View>
    );
  }
}
