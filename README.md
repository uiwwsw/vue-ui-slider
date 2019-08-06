# vue-ui-slider
## vue infinite loop carousel

## install
```
npm install vue-ui-slider
```

## how to use
```
//local
<template>
<div>
<UiSlider> 
//content
</UiSlider>
</div>
</tamplate>
import { UiSlider } from 'vue-ui-slider'
components: {
    ...
    UiSlider,
    ...
  }
```

## option
```
:index="Number" // start index
:duration="Number" // animation duration
:full="Boolean" // single or multi
:infinite="Boolean" // loop infinite
:button="Boolean" // button on off
:pagination="Boolean" // pagination on off
```


### Customize configuration
See [Configuration Reference](https://github.com/uiwwsw).
