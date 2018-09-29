<template>
    <div style="position: relative" class="diy-opcity">

        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <Row class="margin-bottom-10">
                    <Col span="24">
                    <Button type="primary" @click="handleClick()">新增</Button>
                    </Col>
                </Row>
                <el-table :data="dataList" border stripe style="text-align: center" @sort-change="manualSort">
                    <el-table-column prop="khlxbh" label="客户类型编号" width="150"></el-table-column>
                    <el-table-column prop="khlxmc" label="客户类型名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="bz" label="备注" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="operation" label="操作" width="200">
                        <template slot-scope="scope">
                            <span class="span-for-click" @click="action('edit', scope.row)">编辑</span>
                            <span class="span-for-click" style="margin-left:10px;" @click="action('del', scope.row.khlxbh)">删除</span>
                        </template>
                    </el-table-column>

                </el-table>

            </Card>
            </Col>
        </Row>


        <Modal v-model="showAdd" title="客户类型" class="modal-margin">
            <Form ref="AddSourceObj" :model="AddSourceObj" :label-width="100" :show-message="false" >
                <FormItem prop="khlxmc"  label="客户类型名称：">
                    <Input v-model="AddSourceObj.khlxmc" placeholder="请输入客户类型名称" style="width:200px;"></Input>
                    <!--<input type="text" v-model="AddSourceObj.khlxmc" style="width:200px;">-->
                </FormItem>
                <FormItem prop="bz" label="备注：">
                    <Input v-model="AddSourceObj.bz" placeholder="请输入备注" style="width:200px;"></Input>
                    <!--<input type="text" v-model="AddSourceObj.bz" style="width:200px;">-->
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel()">取消</Button>
                <Button type="primary"  @click="confirm()" :loading="loading">确定</Button>
            </div>
        </Modal>

        <Modal v-model="showEdit" title="客户类型" class="modal-margin">
            <Form ref="EditSourceObj" :model="EditSourceObj" :label-width="100" :show-message="false" >
                <FormItem prop="khlxmc"  label="客户类型名称：">
                    <Input v-model="EditSourceObj.khlxmc" placeholder="请输入客户类型名称" style="width:200px;"></Input>
                    <!--<input type="text" v-model="EditSourceObj.khlxmc" style="width:200px;">-->
                </FormItem>
                <FormItem prop="bz" label="备注：">
                    <Input v-model="EditSourceObj.bz" placeholder="请输入备注" style="width:200px;"></Input>
                    <!--<input type="text" v-model="EditSourceObj.bz" style="width:200px;">-->
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel()">取消</Button>
                <Button type="primary"  @click="confirmEdit()" :loading="loading">确定</Button>
            </div>
        </Modal>




        <Modal v-model='showDel' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">删除</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;"><em style="font-style: normal;">{{publicState}}</em></P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="cancel()">取消</Button>
                <Button type="primary" :loading="loadding" @click="sureAction(publicSure)">确定</Button>
            </div>
        </Modal>
        <Spin fix  v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>





    </div>
</template>
<script type="text/ecmascript-6">
    import { apiCustomerType,apiAddType,apiEditType,apiDelType } from '@/config/getData';
    import { notempty } from '@/config/mUtils';
    export default {
        data () {
            return {
                dataList: [],
                showAdd: false,
                showEdit: false,
                showDel: false,
                publicSure:'',
                khlxbh: '',
                publicState: '',
                AddSourceObj: {
                    khlxmc: '',
                    bz: '',
                    khlxbh: '',
                },
                EditSourceObj: {
                    khlxmc: '',
                    bz: ''
                }
            };
        },
        methods: {
            getData(){
                apiCustomerType(this, {

                }).then(res => {
                    if (res && res.status == 1) {
                        this.dataList = res.data;
                    }
                });
            },

            handleClick() {
                this.AddSourceObj.khlxmc = '';
                this.AddSourceObj.bz = '';
                this.showAdd = true;
            },
            cancel() {
                this.showAdd = false;
                this.showEdit = false;
                this.showDel = false;
            },
            confirm() {

                apiAddType(this, {
                    params: JSON.stringify({
                        khlxmc: this.AddSourceObj.khlxmc,
                        bz: this.AddSourceObj.bz,
                    })
                }).then(res => {
                    if (res) {
                        if(res.status == 1){
                            this.$Message.success(res.message);
                            this.getData();
                            this.showAdd = false;
                            this.AddSourceObj.khlxmc = '';
                            this.AddSourceObj.bz = '';
                        }else{
                            this.$Message.error(res.message);
                        }


                    }
                    this.loading = false;
                });
            },
            action(type,val) {

                if(type == 'edit'){
                    this.EditSourceObj.khlxmc = val.khlxmc;
                    this.EditSourceObj.bz = val.bz;
                    this.EditSourceObj.khlxbh = val.khlxbh;
                    this.showEdit = true;
                }
                else if(type == 'del'){
                    this.publicSure = 'del';
                    this.publicState = '确认删除该条记录？';
                    this.khlxbh = val;
                    this.showDel = true;
                    this.loadding = false;
                }

            },
            confirmEdit() {
                apiEditType(this, {
                    params: JSON.stringify({
                        khlxbh: this.EditSourceObj.khlxbh,
                        khlxmc: this.EditSourceObj.khlxmc,
                        bz: this.EditSourceObj.bz,
                    })
                }).then(res => {
                    if (res) {
                        if(res.status == 1){
                            this.$Message.success(res.message);
                            this.getData();
                            this.showEdit = false;
                        }else{
                            this.$Message.error(res.message);
                        }


                    }
                    this.loading = false;
                });

            },
            sureAction(type) {

                if(type == 'del'){
                    apiDelType(this, {
                        khlxbh: this.khlxbh
                    }).then(res => {
                        if (res) {
                            if(res.status == 1){
                                this.$Message.success(res.message);
                                this.getData();
                                this.cancel();
                            }else{
                                this.publicState = '已绑定客户，不可删除！';
                                this.publicSure = 'close';
                                this.showDel = true;
                                this.loadding = false;
                            }
                        }
                        this.loading = false;
                    });

                }
                else if(type == 'close'){
                    this.cancel();
                }


            },
        },
        created () {
            this.getData();
        }

    };
</script>
