import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import HomePage from '@/views/HomePage.vue';

describe('Product catalog', () => {
  test('renders all six products and peso prices', () => {
    const wrapper = mount(HomePage);
    expect(wrapper.findAll('article')).toHaveLength(6);
    expect(wrapper.text()).toContain('Wireless Headphones');
    expect(wrapper.text()).toContain('1,499.00');
  });

  test('combines category and search and resets empty results', async () => {
    const wrapper = mount(HomePage);
    await wrapper.findAll('ion-button').find((button) => button.text() === 'Home')!.trigger('click');
    expect(wrapper.findAll('article')).toHaveLength(1);
    expect(wrapper.find('article').text()).toContain('Table Lamp');
    const search = wrapper.findComponent({ name: 'IonSearchbar' });
    search.vm.$emit('update:modelValue', '  HEADPHONES  ');
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('article')).toHaveLength(0);
    expect(wrapper.text()).toContain('No products found');
    await wrapper.findAll('ion-button').find((button) => button.text() === 'Reset filters')!.trigger('click');
    expect(wrapper.findAll('article')).toHaveLength(6);
    search.vm.$emit('update:modelValue', '  HEADPHONES  ');
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('article')).toHaveLength(1);
    expect(wrapper.find('article').text()).toContain('Wireless Headphones');
  });
});
