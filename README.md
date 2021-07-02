# react-native-backbone
Basic startup project for "react-native"


### Prepared

MobX
- https://mobx.js.org/README.html

react-navigation
- https://reactnavigation.org

axios with apisauce
- https://github.com/axios/axios
- https://github.com/infinitered/apisauce

### 설치방법(Installation)
##### Install dependencies
```
$ npm install
// or
$ npm i
```

```
$ pod install
```

##### Run android
```
$ npx react-native run-android
```
##### Run iOS
```
$ npx react-native run-ios
$ npx react-native run-ios --device "Jack's iPhone"
$ npx react-native run-ios --simulator "iPhone 12"
```

##### 프로젝트명 변경
```
$ npx react-native-rename "Travel Anywhere"
```
> 앱 고유 ID도 같이 변경하기
```
$ npx react-native-rename "Travel Anywhere" -b kr.oursoftware.travel