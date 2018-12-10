<template>
    <table class="table-responsive table table-striped">
        <tbody>
        <tr>
            <th style="width: 10px">#</th>
            <th>Name</th>
            <th>Months</th>
            <th>Expiration</th>
            <th>Price (change)</th>
            <th>Volume</th>
            <th>Updated at</th>
        </tr>
        <tr v-for="(row, index) in data" :key="row.first.symbol+row.second.symbol">
            <td class="text-bold">{{ index + 1 }}.</td>
            <td class="text-bold">{{ row.first.symbol }} / {{ row.second.symbol }}</td>
            <td>
                <span>{{ row.first.expiration | moment("MMMM") }}</span>
                /
                <span>{{ row.second.expiration | moment("MMMM") }}</span>
            </td>
            <td>
                <span
                    :title="calculateExpirationLabel(row)">
                    {{ row.first.daysToExpiration }} days
                </span>
            </td>
            <td :title="'First: USD ' + row.first.last + ' | Second: USD ' + row.second.last">
                <span :class="{ ['text-' + (row.last.isContango ? 'green' : 'red')]: true}">
                    {{ row.last.diff }}
                </span>
                <span :class="{ ['text-' + (row.change >= 0 ? 'green' : 'red')]: true}">
                    ({{ (row.change > 0 ? '+' : '') + row.change }})
                </span>
            </td>
            <td>
                {{ row.volume }}
            </td>
            <td>
                {{ row.calculatedAt | moment('H:mm:ss') }}
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>

export default {
  name: 'SpreadTable',
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    calculateExpirationLabel(row) {
      return `First: ${row.first.expiration} | Second: ${row.second.expiration}`;
    },
  },
  data() {
    return {
      chart: null,
    };
  },
};
</script>
