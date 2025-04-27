<!-- 
 使用说明：
 <file-upload  :files="fileList" :limit="1" @changeFile="changeFile" @removeFile="removeFile"/>
-->
<template>
  <el-upload
     ref="uploadRef"
    :class="listType === 'picture-card'? 'file-picture' : 'file-text'"
    :headers="headers"
    :auto-upload="true"
    :action="uploadUrl"
    :file-list="fileList"
    :show-file-list="false"
    :on-success="onSuccess"
    :before-upload="beforeUpload"
    :multiple="multiple"
    :listType="listType"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
  >
   <el-tooltip content="上传文件" placement="top">
        <el-button icon="ele-Upload" size="small" text type="primary" v-auth="'documentType/update'"/>
    </el-tooltip>
    <template v-if="listType === 'picture-card'" #file="{ file }">
      <div v-if="getFileType(file).type === 'video'" style="position: relative;">
        <el-icon @click="handleRemove(file)" style="position:absolute;top:4px;right:4px;font-size:18px;color:#F56C6C;z-index:50">
          <CircleClose />
        </el-icon>
        <video  controls style="width:100px;height:100px">
          <source :src="file.url">
        </video>
      </div>
      <div v-else>
        <img v-if="getFileType(file).type !== 'image'" class="el-upload-list__item-thumbnail" :src="getFileType(file).icon" alt="" />
        <img v-else class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            v-if="getFileType(file).type === 'image'"
            @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
            class="el-upload-list__item-preview"
            v-if="getFileType(file).type !== 'image'"
            @click="download(file)"
          >
            <el-icon><Download /></el-icon>
          </span>
          <span
            class="el-upload-list__item-delete"
            @click="handleRemoveByUrl(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
      
    </template>
  </el-upload>
  <el-dialog width="900px" v-model="dialogVisible">
    <div style="padding:10px">
      <img v-show="fileType === 'image'" w-full :src="currentFile.url" alt="Preview Image" style="width:100%;height: 500px" />
      <video v-show="fileType === 'video'" :src="currentFile.url" controls width="100%" style="width:100%;height: 500px"></video>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch,onUnmounted } from 'vue';
import { ElMessage,UploadProps, UploadUserFile } from 'element-plus';
import { Delete, Download, Plus, ZoomIn,CircleClose } from '@element-plus/icons-vue'
import config from '/@/utils/config.js';
import { Local, Session } from '/@/utils/storage';
import { formatUrl } from "/@/utils/common";
import wordIcon from '/@/assets/img/file/word.png'
import excelIcon from '/@/assets/img/file/excel.png'
import pptIcon from '/@/assets/img/file/ppt.png'
import pdfIcon from '/@/assets/img/file/pdf.png'
import unknowIcon from '/@/assets/img/file/unknow.png'



const props = defineProps({
  listType:{
    type: String,
    default: 'picture-card',
  },//文件列表类型 picture-card 照片墙布局（适用于图片、视频）， text 文件列表布局（试用于文档，附件）
  limit: {
    type: Number,
    default: 10,
  },//限制个数
  size:{
    type: Number,
    default: 10,
  },//文件限制大小MB
  accept: {
    type: String,
    default: '.pdf,.doc,.docx,.xls,.csv,.xlsx,.jpg,.png,.jpeg',
  },//允许上传的文件类型 传入格式为 ".pdf,.doc,.docx,.xls,.csv,.xlsx,.jpg,.png,.jpeg"
  multiple: {
    type: Boolean,
    default: true,
  },//是否多选
  files:{
    type: Array,
    default: () => [],
  },
  row: {
    type: Object,
    default: () => ({})
  }
});

let fileList:any = reactive([]); // 存储上传的文件列表
let uploadRef:any = ref(null)
watch(
	() => props.files,
	(val) => {
		fileList = [...fileList,...val]
	},
	{
		deep: true,
    immediate: true // 立即执行一次
	}
);

//文件上传地址
let uploadUrl:string = config.base + '/api/sysFile/uploadFile'
//请求头
let headers = reactive({Authorization:''})

const emits = defineEmits(['changeFile','moveFile']);


//文件上传之前的钩子函数
const beforeUpload = (file:any) => {
  if(fileList.length >= props.limit){
    ElMessage.error(`最多只能上传${props.limit}个文件`);
    return false;
  }
  if(props.accept){
    const allowedExtensions = props.accept.split(',')
    const fileExtension = file.name.split('.').pop()
    const isAllowedType = allowedExtensions.includes(`.${fileExtension}`)
    if (!isAllowedType) {
      // ElMessage.error(`上传的文件格式不允许! 允许的格式: ${props.accept}`);
      ElMessage.error(`不正确的文件扩展名${file.name}, 只支持:” ${props.accept} “的文件扩展名`);
      return false;
    }
  }
  
  const maxSize = file.size / 1024 / 1024 < props.size; // 限制文件上传大小
  if (!maxSize) {
    ElMessage.error(`上传文件大小不能超过 ${props.size}MB!`);
    return false;
  }
  return true
};

//文件上传成功的回调函数
const onSuccess = (response: any, uploadFile: any, uploadFiles: any) =>{
  let file = response.result ? response.result : null;
  file && emits('changeFile', file, props.row)
}

//通过文件后缀名判断文件类型
const getFileType = (uploadFile:any) =>{
  const filePath = uploadFile.response?.result?.url || (uploadFile?.raw ?
  uploadFile?.name : uploadFile.url)
  // 通过最后一个 '.' 获取文件扩展名
  const extension = filePath.split('.').pop().toLowerCase();
  let fileType = {
    type:'unknown',
    icon:unknowIcon
  }
  switch (extension) {
    case 'doc':
    case 'docx':
      fileType.type = 'document'
      fileType.icon = wordIcon
      break;
    case 'xls':
    case 'xlsx':
      fileType.type = 'document'
      fileType.icon = excelIcon 
      break;
    case 'pdf':
      fileType.type = 'document'
      fileType.icon = pdfIcon
      break;
    case 'ppt':
    case 'pptx':
      fileType.type = 'document'
      fileType.icon = pptIcon
      break;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
      fileType.type = 'image'
      break;
    case 'mp4':
    case 'avi':
    case 'mkv':
    case 'wmv':
    case 'mov':
      fileType.type = 'video'
      break;
  }

  return fileType
}


//图片/视频预览弹窗
let currentFile:object = reactive({url:'', name:''})
const dialogVisible = ref(false)
let fileType:Ref<string | null> = ref(null)
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  fileType.value = getFileType(uploadFile).type
  currentFile = uploadFile
  currentFile.url = formatUrl(uploadFile.response?.result?.url || uploadFile?.url)
  if(fileType.value === 'image' || fileType.value === 'video'){
    dialogVisible.value = true
  }else{
    download(currentFile)
  }
  
}

//文件移除的回调函数
const handleRemoveByUrl: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  const url = uploadFile?.response?.result?.url || uploadFile.url;
  let index = fileList.findIndex((item:any) => item.url === url)
  if (index !== -1) {
    fileList.splice(index, 1);
    uploadRef.value && uploadRef.value.handleRemove(uploadFile)
  }
  emits('moveFile', fileList,props.row)
}

//下载文件
const download = (file:any) => {
  const url = formatUrl(file?.response?.result?.url || file?.url)
  // 创建a标签
  let a = document.createElement('a')
  // 定义下载名称
  a.download = file.name || file.fileName
  // 隐藏标签
  a.style.display = 'none'
  // 设置文件路径
  a.href = url
  // 将创建的标签插入dom
  document.body.appendChild(a)
  // 点击标签，执行下载
  a.click()
  // 将标签从dom移除
  document.body.removeChild(a)
}

onMounted(() =>{
  const accessToken = Local.get('access-token');
		if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }
})
onUnmounted(() => {
   fileList.length = 0
})

</script>

<style scoped>
.file-preview {
  display: flex;
  flex-wrap: wrap;
}
.file-picture ::v-deep(.el-upload--picture-card), .file-picture ::v-deep(.el-upload-list__item){
  width: 100px;
  height: 100px;
}
.file-text ::v-deep(.el-upload-list__item){
  width: 280px;
}
::v-deep(.el-icon--close-tip){
  display: none;
}
</style>