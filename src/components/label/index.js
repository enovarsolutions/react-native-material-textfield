//@flow
import React, { PureComponent } from 'react';
import { Animated } from 'react-native';

type PropTypes = {
  outline: boolean,
  active: boolean,
  focused: boolean,
  errored: boolean,
  restricted: boolean,

  baseSize: number,
  fontSize: number,
  activeFontSize: number,
  basePadding: number,

  tintColor: string,
  baseColor: string,
  errorColor: string,

  animationDuration: number,

  style: any,

  children: React.ReactNode,
};

export default class Label extends PureComponent<PropTypes> {
  static defaultProps = {
    numberOfLines: 1,

    active: false,
    focused: false,
    errored: false,
    restricted: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      input: new Animated.Value(this.inputState()),
      focus: new Animated.Value(this.focusState()),
    };
  }

  componentWillReceiveProps(props) {
    let { focus, input } = this.state;
    let { active, focused, errored, animationDuration: duration } = this.props;

    if (focused ^ props.focused || active ^ props.active) {
      let toValue = this.inputState(props);

      Animated
        .timing(input, { toValue, duration })
        .start();
    }

    if (focused ^ props.focused || errored ^ props.errored) {
      let toValue = this.focusState(props);

      Animated
        .timing(focus, { toValue, duration })
        .start();
    }
  }

  inputState({ focused, active } = this.props) {
    return active || focused? 1 : 0;
  }

  focusState({ focused, errored } = this.props) {
    return errored? -1 : (focused? 1 : 0);
  }

  render() {
    let { focus, input } = this.state;
    let {
      children,
      restricted,
      fontSize,
      activeFontSize,
      errorColor,
      baseColor,
      tintColor,
      baseSize,
      basePadding,
      style,
      errored,
      active,
      focused,
      animationDuration,
      ...props
    } = this.props;

    let color = restricted?
      errorColor:
      focus.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [errorColor, baseColor, tintColor],
      });

    let top = input.interpolate({
      inputRange: [0, 1],
      outputRange: [
        baseSize + fontSize * 0.25,
        baseSize - basePadding - activeFontSize,
      ],
    });

    const inactiveMargin = 12;
    const activeMargin = this.props.prefix ? 36 : 12;

    let textStyle = {
      fontSize: input.interpolate({
        inputRange: [0, 1],
        outputRange: [fontSize, activeFontSize],
      }),
      marginLeft: input.interpolate({
        inputRange: [0, 1],
        outputRange: [activeMargin, inactiveMargin],
      }),
      color,
      backgroundColor: this.props.outline ? '#fff' : 'transparent',
      paddingHorizontal: 4,
      paddingVertical: 4,
      borderRadius: 4,
    };



    let containerStyle = {
      position: 'absolute',
      top,
    };

    return (
      <Animated.View style={containerStyle}>
        <Animated.Text style={[style, textStyle]} {...props}>
          {children}
        </Animated.Text>
      </Animated.View>
    );
  }
}
