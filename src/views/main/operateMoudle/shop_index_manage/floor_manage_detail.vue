<style>
    .floor-manage-detail .ivu-upload {
        float: none;
        display: inline;
    }
</style>
<template>
    <div class="floor-manage-detail">
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <Row>
                        <Col span="24" style="margin-top: 20px;font-size:16px;">
                            <span>楼层名称： <span style="color: rgb(204, 204, 204);">{{floorsBasic.floor_name}}</span></span>
                        </Col>
                        <Col span="24" style="margin-top: 20px;font-size:16px;">
                            <span>楼层说明： <span style="color: rgb(204, 204, 204);">{{floorsBasic.floor_desc}}</span></span>
                        </Col>
                        <Col span="24" style="margin-top: 20px;font-size:16px;font-weight: 700">
                            <span>楼层详情</span>
                        </Col>
                    </Row>
                    <el-table :data="dataList" border stripe style="text-align: center;width: 100%;margin-top: 15px;"  max-height="570" v-if="$route.query.isEdit" key="isEdit">
                        <el-table-column type="index" :index="indexMethod" label="排序"></el-table-column>
                        <el-table-column show-overflow-tooltip label="图片" :render-header="showTip">
                            <template slot-scope="scope">
                                <Upload :show-upload-list="false" :action="uploadUrl" :format="['jpg','jpeg','png']" :on-success="displayPic">
                                    <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="getUploadIndex(scope.$index)">{{scope.row.pic_path == '' ? '上传' : '更新'}}</span>
                                </Upload>
                                <div style="color: rgb(45, 140, 240);cursor: pointer;margin-left:15px;display: inline;" v-show="scope.row.pic_path" @click="showPicture(scope.row.pic_path)">查看</div>
                                <div style="color: rgb(45, 140, 240);cursor: pointer;margin-left: 15px;display: inline;" v-show="scope.row.pic_path"  @click="deleteItem(scope.$index)">删除</div>
                                <div style="color: rgb(45, 140, 240);cursor: pointer;margin-left: 15px;display: inline;" v-show="scope.row.pic_path"  @click="moveTowardsTop(scope.$index)" v-if="scope.$index > 0">上移</div>
                                <div style="color: rgb(45, 140, 240);cursor: pointer;margin-left: 15px;display: inline;" v-show="scope.row.pic_path"  @click="moveTowardsBottom(scope.$index)" v-if="scope.$index < totalNum - 1">下移</div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="图片路径" prop="pic_path"></el-table-column>
                        <el-table-column show-overflow-tooltip label="图片说明" prop="pic_desc">
                            <template slot-scope="scope">
                                <Input v-model="scope.row.pic_desc" placeholder="输入图片说明" :disabled="!scope.row.pic_path"></Input>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="链接地址" prop="url_path">
                            <template slot-scope="scope">
                                <Input v-model="scope.row.url_path" placeholder="输入链接地址" :disabled="!scope.row.pic_path"></Input>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-table :data="dataList" border stripe style="text-align: center;width: 100%;margin-top: 15px;"  max-height="570" v-if="!$route.query.isEdit" key="isNotEdit">
                        <el-table-column type="index" :index="indexMethod" label="排序"></el-table-column>
                        <el-table-column show-overflow-tooltip label="图片">
                            <template slot-scope="scope">
                                <div style="color: rgb(45, 140, 240);cursor: pointer;margin-left:15px;display: inline;" v-show="scope.row.pic_path" @click="showPicture(scope.row.pic_path)">查看</div>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip label="图片路径" prop="pic_path"></el-table-column>
                        <el-table-column show-overflow-tooltip label="图片说明" prop="pic_desc"></el-table-column>
                        <el-table-column show-overflow-tooltip label="链接地址" prop="url_path"></el-table-column>
                    </el-table>
                </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <Button type="primary"class="margin-top-10" style="margin:auto;margin-left:200px;" @click="backToList">返回</Button>
                <Button type="primary" style="margin-left:20px;" @click="saveData" v-if="$route.query.isEdit">保存</Button>
            </Card>
            </Col>
        </Row>
        <Modal v-model="pickPicModal" title="查看图片" width="600">
            <Row>
                <col span="24">
                    <div style="width:100%" v-if="pickPicModal">
                        <img :src="currentPicUrl" style="width: 100%;height: auto;">
                    </div>
                </col>
            </Row>
            <div slot="footer"></div>
        </Modal>
        <Spin fix  v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<script type="text/ecmascript-6">
    import { mallAllFloorsDetailApi, mallAllFloorsDetailEditApi } from '@/config/getData';
    import {setToken} from '@/config/mUtils';

    export default {
        data () {
            return {
                spinShow: false,
                floorsBasic: {
                    floor_name: '',
                    floor_desc: '',
                },
                uploadUrl: this.baseUrl + '/v1/mall/floors/upload?token=' + setToken(),
                currentId: 0,
                totalNum: 0,
                currentPicUrl: '',
                pickPicModal: false,
                dataList: [],
            };
        },
        methods: {
            getData(){
                this.spinShow = true;
                mallAllFloorsDetailApi(this, {
                    id: this.$route.query.id
                }).then(res => {
                    if (res && res.status == 1) {
                        // 楼层基本信息
                        this.floorsBasic = res.data.floors;
                        //楼层详细信息
                        this.dataList = res.data.details;
                        this.totalNum = res.data.details.length;
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.spinShow = false;
                });
            },
            saveData() {
                if (this.dataList[0].pic_path == '') {
                    this.$Message.error('首图不能为空');
                    return;
                }
                for (let i = 0; i < this.dataList.length; i++) {
                    if (this.dataList[i].pic_path) {
                        if (this.dataList[i].pic_desc == '') {
                            this.$Message.error(`第${i+1}行图片说明不能为空!`);
                            return;
                        }
                        if (this.dataList[i].url_path == '') {
                            this.$Message.error(`第${i+1}行链接地址不能为空!`);
                            return;
                        }
                    }
                }
                this.dataList.forEach((item, index) => {
                    item.sort = index;
                });
                this.spinShow = true;
                mallAllFloorsDetailEditApi(this, {
                    id: this.$route.query.id,
                    params: JSON.stringify(this.dataList)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('修改成功!');
                        this.getData();
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.spinShow = false;
                });
            },
            moveTowardsTop(index) {
                let tmpItem = this.dataList.splice(index, 1)[0];
                this.dataList.splice((index - 1), 0, tmpItem);
            },
            moveTowardsBottom(index) {
                let tmpItem = this.dataList.splice(index, 1)[0];
                this.dataList.splice((index + 1), 0, tmpItem);
            },
            showPicture(url) {
                this.currentPicUrl = this.imgURL + url;
                this.pickPicModal = true;
            },
            deleteItem(index) {
                this.dataList[index].pic_path = '';
                this.dataList[index].pic_desc = '';
                this.dataList[index].url_path = '';
            },
            getUploadIndex(index) {
                this.currentId = index;
            },
            displayPic(res, file, fileList) {
                this.dataList[this.currentId].pic_path = res.data.url;
            },
            indexMethod(index) {
                return index;
            },
            backToList() {
                history.go(-1);
            },
            showTip(h, {column, $index}) {
                let label = column.label;
                return h('span', {
                    'attrs': {
                        title: `尺寸：234*234像素
格式：jpg、png`
                    }
                }, [label])
            }
        },
        created () {
            this.getData();
        }
    };
</script>