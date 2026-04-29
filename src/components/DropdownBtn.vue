<script setup lang="ts">
import { defineProps, defineEmits, ref, watchEffect } from 'vue'

const props = defineProps<{
  options: any[]
  valueFeild: string
  modelValue: any
  defaultSelected?: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const isOpen = ref(false)
const selectedOption = ref(props.defaultSelected || props.options?.[0])

watchEffect(() => {
  selectedOption.value = props.modelValue || props.defaultSelected || props.options?.[0]
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function handleSelectOption(option: any) {
  selectedOption.value = option
  isOpen.value = false
  emit('update:modelValue', option)
}
</script>

<template>
  <div class="dropdown-container">
    <button class="dropdown-button" @click="toggleDropdown">
      <slot name="button" :selectedOption="selectedOption">
        {{ selectedOption[props.valueFeild] }}
      </slot>
    </button>

    <ul v-if="isOpen" class="dropdown-list">
      <li
        v-for="(option, index) in props.options"
        :key="index"
        :class="[
          'dropdown-item',
          { selected: option[props.valueFeild] === selectedOption[props.valueFeild] },
        ]"
        @click="handleSelectOption(option)"
      >
        <slot :option="option">{{ option[props.valueFeild] }}</slot>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.dropdown-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

.dropdown-button {
  width: 100%;
  height: 35px;
  line-height: 35px;
  background-color: var(--cb-bgc4);
  color: var(--cb-fColor);
  border: 1px solid var(--cb-borderColor2);
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
}

.dropdown-button:focus {
  outline: none;
}

.dropdown-list {
  position: absolute;
  z-index: 99;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background-color: var(--cb-bgc4);
  border: 1px solid var(--cb-borderColor2);
  border-radius: 4px;
  list-style-type: none;
  padding: 0;
  margin: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
  text-align: center;
}

.dropdown-item:hover {
  background-color: var(--cb-bgc3);
}

.selected {
  background-color: var(--cb-bgc3);
  color: var(--cb-fColor4);
}
</style>
