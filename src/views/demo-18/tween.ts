import TWEEN from 'three/examples/jsm/libs/tween.module.js';
class TweenManger {
  numTweensRunning: number
  constructor() {
    this.numTweensRunning = 0;
  }
  _handleComplete() {
    --this.numTweensRunning;
    console.assert(this.numTweensRunning >= 0); /* eslint no-console: off */

  }
  createTween(targetObject: any): any {
    const self = this;
    ++this.numTweensRunning;
    let userCompleteFn = () => { };
    // create a new tween and install our own onComplete callback
    const tween = new TWEEN.Tween(targetObject).onComplete(function (...args) {
      self._handleComplete();
      userCompleteFn.call(this, ...args);
    });
    // replace the tween's onComplete function with our own
    // so we can call the user's callback if they supply one.
    tween.onComplete = (fn: any) => {
      userCompleteFn = fn;
      return tween;
    };
    return tween;
  }
  update() {
    TWEEN.update();
    return this.numTweensRunning > 0;
  }
  destroy() {
    TWEEN.removeAll();
    this.numTweensRunning = 0;
  }
}

export { TweenManger };
