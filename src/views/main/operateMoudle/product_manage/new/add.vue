<template>
    <div style="position: relative">
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        产品基础信息
                    </p>
                    <Form inline :label-width="100">
                        <FormItem label="单据备注：" style="width: 100%">
                            <Input type="textarea" v-model="notes" :rows="2" placeholder="请输入单据备注"></Input>
                        </FormItem>
                    </Form>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title" class="card-title">
                        产品信息
                    </p>
                    <el-table :data="goodsData" border stripe style="text-align: center" >
                        <el-table-column prop="brand_name" label="品牌" width="120"></el-table-column>
                        <el-table-column prop="general_series" label="通用系列" min-width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_category_name" label="产品类别" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="product_name" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <span style="color: rgb(45, 140, 240);cursor: pointer;" @click="deleteItem(scope.$index)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </Card>
            </Col>
        </Row>
        <Row style="margin-top: 68px;"></Row>
        <Row style="position: fixed;text-align: center;left: 0;bottom: 0;width: 100%;z-index: 888;">
            <Col span="24">
            <Card>
                <div style="width: 275px;margin:0 auto;">
                    <Button type="primary" class="margin-top-10" style="margin:auto;" @click="downTemplate">下载模板</Button>
                    <Upload :action="importApi" name="file" :format="['csv']" :on-success="handleSuccess" :show-upload-list="false">
                        <Button type="ghost" icon="ios-cloud-upload-outline">导入</Button>
                    </Upload>
                    <Button type="info" class="margin-top-10"  :loading="loading" style="margin:auto;margin-left: 20px;" @click="createNewProduct()">保存</Button>
                </div>
            </Card>
            </Col>
        </Row>
        <input type="file" name="csvfile" id="csv-upload" style="display: none" v-on:change="csvToJson()" />
        <Spin fix v-if="showSpin">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
        <Modal v-model="showModal" title="导入结果">
            <Row>
                <col span="24">
                    <Card>
                        <Form :label-width="100">
                            <Row>
                                <Col span="24">
                                    <FormItem label="导入成功：">
                                        <span>{{importInfo.success}}条</span>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="导入失败：">
                                        <span>{{importInfo.fail}}条</span>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </col>
            </Row>
            <div slot="footer">
                <Button type="primary" @click="cancelShowModal">确定</Button>
                <Button type="primary" @click="confirmExportFailedList">导出失败数据</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '@/views/common/pagination.vue';
    import util from '@/libs/util'
    import { operateProductAddDetailSave, operateProductAddTmplateDown, operateProductAddDetailImport, operateProductAddDetailFailedExport } from '@/config/getData';
    import {setToken} from '@/config/mUtils';
    export default {
        data () {
            return {
                isEdit: true,
                loading: false,
                goodsData: [],
                allData: [],
                totalnum: 0,
                currentPage: 1,
                limit: 10,
                notes: '',
                importApi: this.baseUrl + '/common/read-csv?token=' +  setToken(),
                importInfo: {
                    success: 0,
                    fail: 0
                },
                failedData: [],
                showModal: false,
                showSpin: false
            };
        },
        components: {
            pagination
        },
        methods: {
            deleteItem(index) {
                this.goodsData.splice(index, 1);
            },
            downTemplate() {
                operateProductAddTmplateDown(this, {});
            },
            handleSuccess(arr) {
                this.showSpin = true;
                let postData = JSON.parse(JSON.stringify(arr));
                operateProductAddDetailImport(this, {
                    params: JSON.stringify(postData)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.importInfo.success = res.data.success_count;
                        this.importInfo.fail = res.data.error_count;
                        this.failedData = res.data.error_msg;
                        this.goodsData = res.data.success_info;
                        // this.totalnum = res.data.success_info.length;
                        // this.goodsData = this.allData.slice(0, this.limit);
                        if (+this.importInfo.fail > 0) {
                            this.showModal = true;
                        }
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.showSpin = false;
                });
            },
            confirmExportFailedList() {
                operateProductAddDetailFailedExport(this, {
                    params: JSON.stringify(this.failedData)
                });
            },
            cancelShowModal() {
                this.showModal = false;
            },
            createNewProduct () {
                this.showSpin = true;
                this.loading = true;
                operateProductAddDetailSave(this, {
                    note: this.notes,
                    params: JSON.stringify(this.goodsData)
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('保存成功!');
                        setTimeout(()=> {
                            util.openNewPage(this, 'operate_products_new_detail', {
                                order_no: res.data
                            });
                            this.$router.push({
                                name: 'operate_products_new_detail',
                                query: {
                                    order_no: res.data
                                }
                            });
                        }, 300);
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.showSpin = false;
                    this.loading = false;
                });
            },
            getNowPage (page) {
                this.currentPage = page;
                let _start = (page - 1) * this.limit;
                let _end = page * this.limit;
                this.goodsData = this.allData.slice(_start, _end);
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
        }
    };
</script>
