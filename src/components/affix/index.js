//@flow
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Animated } from 'react-native';

import styles from './styles';

type propTypes = {
  numberOfLines: number,

  active: boolean,
  focused: boolean,

  type: 'prefix' | 'suffix',

  fontSize: number,
  baseColor: string,
  animationDuration: number,

  style: any,

  children: React.ReactNode,
};

export default class Affix extends PureComponent<propTypes> {
  static defaultProps = {
    numberOfLines: 1,

    active: false,
    focused: false,
  };

  constructor(props) {
    super(props);

    let { active, focused } = this.props;

    this.state = {
      opacity: new Animated.Value((active || focused)? 1 : 0),
    };
  }

  componentWillReceiveProps(props) {
    let { opacity } = this.state;
    let { active, focused, animationDuration } = this.props;

    if ((focused ^ props.focused) || (active ^ props.active)) {
      Animated
        .timing(opacity, {
          toValue: (props.active || props.focused)? 1 : 0,
          duration: animationDuration,
        })
        .start();
    }
  }

  render() {
    let { opacity } = this.state;
    let { style, children, type, fontSize, baseColor: color } = this.props;

    let containerStyle = {
      height: fontSize * 1.5,
      opacity,
    };

    let textStyle = {
      color,
      fontSize,
    };

    switch (type) {
      case 'prefix':
        containerStyle.paddingRight = 8;
        textStyle.textAlign = 'left';
        break;

      case 'suffix':
        containerStyle.paddingLeft = 8;
        textStyle.textAlign = 'right';
        break;
    }

    return (
      <Animated.View style={[styles.container, containerStyle]}>
        <Animated.Text style={[style, textStyle]}>{children}</Animated.Text>
      </Animated.View>
    );
  }
}
