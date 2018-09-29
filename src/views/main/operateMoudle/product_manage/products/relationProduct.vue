<style>
    .hidden-footer .ivu-modal-footer {
        
    }
</style>
<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <Row class="margin-bottom-10">
                        <Col span="24">
                            <Button type="primary" @click="translatePrd()">转移产品</Button>
                        </Col>
                    </Row>
                    <el-table :data="productList" border style="text-align: center" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column label="产品型号编号" prop="cpxhbh" width="120"></el-table-column>
                        <el-table-column prop="cpppmc" label="商品品牌"></el-table-column>
                        <el-table-column prop="cpdhh" label="商品订货号" ></el-table-column>
                        <el-table-column prop="cpbh" label="产品编号" ></el-table-column>
                        <el-table-column prop="cpmcty" label="通用系列" min-width="120"></el-table-column>
                        <el-table-column prop="cpmc" label="产品名称" min-width="150"></el-table-column>
                        <el-table-column prop="cplbmc" label="产品类别名称"></el-table-column>
                        <el-table-column prop="cpzt" label="商品状态" >
                            <template slot-scope="scope">
                               <span>{{ scope.row.cpzt == 1 ? '激活' : '冻结' }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </Card>
            </Col>
        </Row>
        <Modal v-model="showTranslate" title="转入产品选择" width="1000" class="hidden-footer">
            <Row>
                <Col span="24">
                    <Card>
                        <Row class="margin-bottom-10">
                            <Form :label-width="100">
                                <Col span="6">
                                    <FormItem label="产品编号：">
                                        <Input v-model="productId"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="6">
                                    <FormItem>
                                        <Button type="primary"  @click="search">搜索</Button>
                                    </FormItem>
                                </Col>
                            </Form>
                        </Row>
                        <el-table :row-class-name="tableRowClassName" :data="productSelectedList" border style="text-align: center" highlight-current-row @current-change="handleCurrentChange">
                            <el-table-column type="index" width="50" label="序号"></el-table-column>
                            <el-table-column label="产品编号" prop="cpbh"></el-table-column>
                            <el-table-column prop="cpmc" label="产品名称" ></el-table-column>
                            <el-table-column prop="cpmcty" label="通用系列" ></el-table-column>
                            <el-table-column prop="cplbmc" label="产品类别"></el-table-column>
                            <el-table-column prop="is_deleted" label="状态" >
                                <template slot-scope="scope">
                                   <span>{{ cp_state[scope.row.is_deleted] }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </Card>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary"  @click="confirmTranslate">确认</Button>
            </div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiAllStatus,apiGetProductGetCpxh,apiGetProductSeriesList,apiGetProductCpxhTransfer } from '@/config/getData';

    export default {
        data () {
            return {
                cpbh:this.$route.query.param,
                showTranslate: false,
                selectedToAdd: [],
                productList: [],
                cp_state: {},
                productId: '',
                productSelectedList: [],
                newCpbh:'',
            };
        },
        methods: {
            tableRowClassName({row, rowIndex}) {
                if (row.isSelected) {
                 return 'selected-row';
                }
            },
            getStatus () {
                /*所有状态*/
                apiAllStatus(this, {
                    type: JSON.stringify(['cp_state'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.cp_state = res.data.cp_state;
                    }
                });
            },
            getData(){
                apiGetProductGetCpxh(this, {
                    params: JSON.stringify(this.notempty({
                        cpbh: this.cpbh,
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        this.productList = res.data.product_info;
                    }
                });


            },
            search(){

                if(this.productId != ''){
                    apiGetProductSeriesList(this, {
                        params: JSON.stringify(this.notempty({
                            numPerPage: 99999,
                            cpbh: this.productId,
                        }))
                    }).then(res => {
                        if (res && res.status == 1) {
                            res.data.list.forEach(item => {
                                item.isSelected = false;
                            });
                            this.productSelectedList = res.data.list;
                        }
                    });
                }

            },

            confirmTranslate() {

                if(this.newCpbh == ''){
                    this.$Message.error('请选择转入的产品');
                    return;
                }

                apiGetProductCpxhTransfer(this, {
                    cpbh:this.newCpbh,
                    params: JSON.stringify({
                        info: this.selectedToAdd,
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.showTranslate = false;
                        this.$Message.success('转移成功');
                        this.getData();

                    }
                    else{
                        this.$Message.error('转移失败');
                    }
                });



            },
            translatePrd() {

                if(this.selectedToAdd.length == 0){
                    this.$Message.error('请至少选择一项');
                    return;
                }

                this.showTranslate = true;
            },
            handleSelectionChange(selected) {
                this.productSelectedList.forEach(item => {
                    item.isSelected = false;
                });
                this.selectedToAdd = [];
                selected.forEach(item => {
                    item.isSelected = true;
                    this.selectedToAdd.push(item.cpxhbh);
                });
                console.log(selected);
            },
            handleCurrentChange(val) {
                this.newCpbh = val.cpbh;

            }
        },
        created () {
            this.getStatus();
            this.getData();
        }
    };
</script>
