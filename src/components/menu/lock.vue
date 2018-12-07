<template>
  <MenuItem :name="this.model.id">
          <Poptip title="缺少下列权限" :content="this.model.computed_executable_perms.toString()" placement="right">
              {{this.model.title}}<icon type="md-lock"/>
          </Poptip>
  </MenuItem>
</template>
<script>

export default {
      props: ['model']
}
</script>
