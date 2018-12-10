<template>
  <footer class="main-footer">
    <div class="pull-right hidden-xs">
      <b>Version</b> {{ version }}
    </div>
    <span>
      Made with <strong>love</strong>
    </span>
  </footer>
</template>

<script>
import { version } from '../../package.json';

export default {
  name: 'MyFooter',
  data() {
    return {
      version,
    };
  },
};
</script>
