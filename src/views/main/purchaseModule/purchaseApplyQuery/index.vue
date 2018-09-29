<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <Form :label-width="100">
                    <Row>
                        <Col span="24">
                            <FormItem label="请选择采购类型" style="margin-bottom: 5px">
                                <RadioGroup v-model="purchaseType" @on-change="bulkAdd">
                                    <Radio label="1">
                                        <span>备货</span>
                                    </Radio>
                                    <Radio label="2">
                                        <span>调货</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <el-table :row-class-name="tableRowClassName" :data="dataList" border style="text-align: center;width:100%"   @sort-change="manualSort"  max-height="570">
                    <el-table-column show-overflow-tooltip prop="cpxhbh" label="产品型号编号" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpdhh" label="订货号" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpxh" label="产品型号" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpppmc" label="品牌" min-width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpmcty" label="通用系列"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpmc" label="产品名称" min-width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip label="采购类型">
                        <template slot-scope="scope">
                            <span>{{scope.row.type | typeName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="供应商名称" min-width="160">
                        <template slot-scope="scope">
                            <Select v-model="scope.row.gysbh" transfer @on-change="changeApplyInfo(scope)">
                                <Option v-for="item in scope.row.supplier_list" :value="item.gysbh" :key="item.gysbh">{{ item.gysmc }}</Option>
                            </Select>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="discount_min" label="折扣下限" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="discount_max" label="折扣上限" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="leadtime" label="货期" sortable="custom"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="note" label="备注"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="priority" label="优先级"></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalNum" :current="currentPage" :getPageSize="limit"></pagination>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <Row>
                        <Col span="8" class="margin-top-10">
                            <Input type="textarea" v-model="bulktext" class="bulktext" @on-blur="isShow" @on-focus="isHidden" id="placeholderAction"></Input>
                            <div style="position: absolute;left:10px;top:10px;z-index: 0;" v-if="is_show" @click="isHidden">
                                <div style="color:#999;">批量添加订货号/产品型号，用空格隔开（支持从Excel复制）</div>
                                <div style="color:#999;">示例：</div>
                                <div style="color:#999;">101275386</div>
                                <div style="color:#999;">101065317</div>
                            </div>
                        </Col>
                        <Col span="6" class="padding-left-20 margin-top-10">
                            <Button type="primary" style="margin-top:88px;" @click="bulkAdd">批量添加</Button>
                        </Col>
                        <Col span="10" v-if="notFoundData.length != 0">
                            <el-table :row-class-name="tableRowClassName" :data="notFoundData" border style="text-align: center">
                                <el-table-column show-overflow-tooltip label="订货号/产品型号" prop="id"></el-table-column>
                                <el-table-column show-overflow-tooltip label="模糊查询">
                                    <template slot-scope="scope">
                                        <span @click="showCurrentModal(scope.row.id)" style="color: rgb(45, 140, 240);cursor: pointer;">查看</span>
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="失败原因" prop="reason"></el-table-column>
                                <el-table-column show-overflow-tooltip label="操作">
                                    <template slot-scope="scope">
                                        <span @click="deleteNotFound(scope.$index)" style="color: rgb(45, 140, 240);cursor: pointer;">删除</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <Modal v-model='fuzzyModal' :mask-closable=false width="1500">
            <h3 slot="header">模糊查询</h3>
            <div>
                <el-table :row-class-name="tableRowClassName" :data="fuzzyData" border style="text-align: center" max-height="500" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" ></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpppmc" label="品牌" min-width="100"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpmc" label="产品名称" min-width="150"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpxhbh" label="产品型号" min-width="120"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="cpdhh" label="订货号" min-width="120"></el-table-column>
                </el-table>
            </div>
            <div slot="footer">
                <Button type="text" @click="closeModal">取消</Button>
                <Button type="primary" :loading="loadding" @click="confirmAdd">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import { purchaseApplyQueryList, purchaseApplySwitch, purchaseApplyFuzzySearch } from '@/config/getData';
    import {sortBy} from '@/config/mUtils';
    import pagination from '@/views/common/pagination.vue'
    import util from '@/libs/util';

    export default {
        data () {
            return {
                dataList: [],
                ajaxHistoryData: [],
                notFoundData: [],
                bulktext: '',
                is_show: '',
                purchaseType: '1',
                spinShow: false,
                copyAllData: [],
                fuzzyModal: false,
                fuzzyData: [],
                selectGoods: [],
                loadding: false,

                currentPage: 1,
                limit: 10,
                totalNum: 0
            };
        },
        components: {
            pagination
        },
        methods: {
            getNowPage (page) {
                this.currentPage = page;
                let _start = (page - 1) * this.limit;
                let _end = page * this.limit;
                this.dataList = this.ajaxHistoryData.slice(_start, _end);
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getNowPage(this.currentPage);
            },
            /*批量添加*/
            bulkAdd () {
                this.spinShow = true;
                let arr = this.bulktext.replace(/[\r\n]/g, ',');
                let arrStr = arr.split(',');
                let arrList = [];
                for (let i in arrStr) {
                    arrList.push(arrStr[i]);
                }
                purchaseApplyQueryList(this, {
                    search_products: JSON.stringify(arrList),
                    type: this.purchaseType
                }).then(res => {
                    if (res && res.status == 1) {
                        this.ajaxHistoryData = res.data.list;
                        this.copyAllData = JSON.parse(JSON.stringify(res.data.list));
                        this.totalNum = res.data.list.length;
                        this.getNowLimit(this.limit);
                        this.notFoundData = [];
                        res.data.not_exist.forEach(item => {
                            this.notFoundData.push({
                                id: item,
                                reason: '订货号/产品型号不存在'
                            });
                        })
                    } else {
                        this.ajaxHistoryData = [];
                        this.totalNum = 0;
                        this.dataList = [];
                        this.notFoundData = [];
                        this.$Message.error(res.message);
                    }
                    this.spinShow = false;
                })
            },
            deleteNotFound(index) {
                this.notFoundData.splice(index, 1);
            },
            showCurrentModal(id) {
                purchaseApplyFuzzySearch(this, {
                    params: JSON.stringify({
                        search: id,
                        type: this.purchaseType
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.fuzzyData = res.data.list;
                        this.fuzzyModal = true;
                    } else {
                        this.$Message.error(res.message);
                    }
                })
            },
            handleSelectionChange(selectedval) {
                this.selectGoods = selectedval;
            },
            closeModal() {
                this.fuzzyModal = false;
            },
            confirmAdd() {
                if (this.selectGoods.length <= 0) {
                    this.$Message.error('请至少选择一项！');
                    return;
                }
                this.copyAllData = this.copyAllData.concat(this.selectGoods);
                this.ajaxHistoryData = JSON.parse(JSON.stringify(this.copyAllData));
                this.getNowLimit(this.limit);
                this.fuzzyModal = false;

            },
            changeApplyInfo(scope) {
                purchaseApplySwitch(this, {
                    params: JSON.stringify({
                        gysbh: scope.row.gysbh,
                        cpxhbh: scope.row.cpxhbh
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //分页数据改动，接口源数据也要改动
                        for (let i = 0; i < this.copyAllData.length; i++) {
                            if (this.copyAllData[i].cpxhbh === scope.row.cpxhbh) {
                                this.copyAllData[i].gysbh = scope.row.gysbh;
                                this.copyAllData[i].discount_max = res.data.discount_max === null ? '' : res.data.discount_max;
                                this.copyAllData[i].discount_min = res.data.discount_min === null ? '' : res.data.discount_min;
                                this.copyAllData[i].leadtime = res.data.leadtime === null ? '' : res.data.leadtime;
                                this.copyAllData[i].note = res.data.note === null ? '' : res.data.note;
                                this.copyAllData[i].priority = res.data.priority === null ? '' : res.data.priority;
                                break;
                            }
                        }
                        this.ajaxHistoryData = JSON.parse(JSON.stringify(this.copyAllData));
                        this.getNowLimit(this.limit);
                    } else {
                        this.$Message.error(res.message);
                    }
                })
            },
            isHidden () {
                this.is_show = false;
                document.getElementById('placeholderAction').firstChild.focus();

            },
            isShow () {
                if (this.bulktext === '') {
                    this.is_show = true;
                } else {
                    this.is_show = false;
                }
            },
            //排序
            manualSort (column) {
                let isDec = column.order == "descending" ? true : false;
                this.copyAllData.sort(sortBy(column.prop, isDec));
                this.ajaxHistoryData = JSON.parse(JSON.stringify(this.copyAllData));
                this.getNowLimit(this.limit);
            }
        },
        created () {
        },
        filters: {
            typeName (value) {
                let name = '备货'
                if (value == '1') {
                    name = '备货';
                } else {
                    name = '调货';
                }
                return name;
            }
        }
    };
</script>
