<template>
    <div class="row">
        <div class="col-lg-7">
            <FutureSpreadBox futures-name="VX" underlying-name="VIX" />
        </div>
        <div class="col-lg-5">
            <AvIndexBox name="VIX" />
        </div>
    </div>
</template>

<script>
import FutureSpreadBox from '../../components/FutureSpreadBox';
import AvIndexBox from '../../components/AvIndexBox';

export default {
  name: 'Home',
  components: {
    AvIndexBox,
    FutureSpreadBox,
  },
};
</script>
