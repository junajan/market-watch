<template>

        <div class="error-page">
            <h2 class="headline text-yellow">
                <i class="fa fa-warning text-yellow"></i>
            </h2>

            <div class="error-content">
                <h3> 404 Page not found.</h3>
                <p>
                    We could not find the page you are looking for.
                    You may <router-link to="/">return to dashboard</router-link> and start over.
                </p>
            </div>
            <!-- /.error-content -->
        </div>
        <!-- /.error-page -->
</template>

<script>
export default {
  name: 'Home',
};
</script>
