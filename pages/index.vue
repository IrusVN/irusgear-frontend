<script setup>
import { useI18n } from "#imports";

const { t } = useI18n();

useHead({ title: t('page_titles.home') });

definePageMeta({
  middleware: () => navigateTo('/dashboard')
});
</script>
