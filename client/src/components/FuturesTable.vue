<template>
    <table class="table-responsive table table-striped">
        <tbody>
        <tr>
            <th style="width: 10px">#</th>
            <th>Name</th>
            <th>Last</th>
            <th>High</th>
            <th>Low</th>
            <th>Volume</th>
            <th>Settlement</th>
            <th>Expiration</th>
            <th>Type</th>
            <th>Loaded At</th>
        </tr>
        <tr v-for="(row, index) in data" v-if="!row.isWeekly || weeklyOn" :key="row.symbol">
            <td class="text-bold">{{ index + 1 }}.</td>
            <td class="text-bold">
                {{ row.symbol }}
                <span v-if="!row.isWeekly">
                    ({{ row.expiration | moment("MMMM") }})
                </span>
            </td>
            <td>
                {{ row.last }}
                <span :class="{ ['text-' + (row.change >= 0 ? 'green' : 'red')]: true}">
                    ({{ (row.change > 0 ? '+' : '') + row.change }})
                </span>
            </td>
            <td>{{ row.high }}</td>
            <td>{{ row.low }}</td>
            <td>{{ row.volume }}</td>
            <td>{{ row.settlement }}</td>
            <td :title="row.expiration">
                {{ row.daysToExpiration }} days
            </td>
            <td :class="{ 'text-bold': !row.isWeekly }">
                {{ row.isWeekly ? 'weekly': 'monthly' }}
            </td>
            <td>
                {{ row.loadedAt | moment('H:mm:ss') }}
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
export default {
  name: 'FuturesTable',
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    weeklyOn: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
