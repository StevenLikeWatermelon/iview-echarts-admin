<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form style="border-bottom:1px solid #e0e0e0;">
                    <Row class="margin-bottom-20">
                        <Col span="8">
                            <i-input v-model="formInput" @on-enter="search">
                                <i-button slot="append" icon="ios-search" @click="search" ></i-button>
                            </i-input>
                        </Col>
                    </Row>
                </Form>
                <div class="margin-top-20">
                    <div style="width:40%;float:left;position:relative;">
                        <Tree :data="baseData" @on-select-change="changeDepart"></Tree>
                        <Button-group style="position:absolute;right:20px;top:10px;" v-if="iconButtonGroup"  size="small">
                            <i-button type="ghost" icon="edit" @click="editInfo"></i-button>
                            <i-button type="ghost" icon="minus-round" @click="delInfo"></i-button>
                            <i-button type="ghost" icon="plus-round" @click="addInfo"></i-button>
                        </Button-group>
                    </div>
                    <div style="width:450px;float:left;" class="margin-top-10">
                        <!-- 信息 -->
                        <div style="border:1px solid #e0e0e0;border-radius:5px;padding:20px;" v-if="inforBlock">
                            <Row>
                                <Col span="24">
                                    <span style="font-size:16px;font-weight:600;color:#666;">{{infoTitle}}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="24" class="margin-top-20">
                                    <span>所属上级：</span>
                                    <span>{{organizeInfo.uplevel}}</span>
                                </Col>
                                <Col span="24" class="margin-top-20">
                                    <span>部门编号：</span>
                                    <span>{{organizeInfo.depart_no}}</span>
                                </Col>
                                <Col span="24" class="margin-top-20">
                                    <span>部门名称：</span>
                                    <span>{{organizeInfo.depart_name}}</span>
                                </Col>
                            </Row>
                        </div>
                        <!-- 新增 -->
                        <div style="border:1px solid #e0e0e0;border-radius:5px;" v-if="addBlock">
                            <Row style="padding:10px 20px;border-bottom:1px solid #e0e0e0;">
                                <Col span="24">
                                    <span style="font-size:16px;font-weight:600;color:#666;">新增部门</span>
                                </Col>
                            </Row>
                            <Form :label-width="100" style="padding: 0 20px 20px;" :model="addDepart">
                                <Col span="24" class="margin-top-20">
                                    <FormItem label="所属上级：" style="margin:0;">
                                        {{addDepart.uplevel}}
                                    </FormItem>
                                </Col>
                                <Col span="24" class="margin-top-20">
                                    <FormItem label="部门名称：" style="margin:0;" class="redRequire">
                                        <Input type="text" v-model="addDepart.depart_name" style="width:250px;"></Input>
                                    </FormItem>
                                </Col>
                                <div class="clear"></div>
                            </Form>
                            <Row style="padding:10px 20px;border-top:1px solid #e0e0e0;" class="margin-top-10">
                                <Col span="24">
                                    <Button type="primary" style="float:right;margin-left:20px;" @click="addSave">保存</Button>
                                    <Button type="default" style="float:right;" @click="addCancel">取消</Button>
                                </Col>
                            </Row>
                        </div>
                        <!-- 修改 -->
                        <div style="border:1px solid #e0e0e0;border-radius:5px;background:#fff;" v-if="editBlock">
                            <Row style="padding:10px 20px;border-bottom:1px solid #e0e0e0;">
                                <Col span="24">
                                    <span style="font-size:16px;font-weight:600;color:#666;">部门修改</span>
                                </Col>
                            </Row>
                            <Form :label-width="100" style="padding: 0 20px 20px;" :model="editDepart">
                                <Col span="24" class="margin-top-20">
                                    <FormItem label="所属上级：" style="margin:0;">
                                        {{editDepart.uplevel}}
                                    </FormItem>
                                </Col>
                                <Col span="24" class="margin-top-20">
                                    <FormItem label="部门编号：" style="margin:0;">
                                        {{editDepart.depart_no}}
                                    </FormItem>
                                </Col>
                                <Col span="24" class="margin-top-20">
                                    <FormItem label="部门名称：" style="margin:0;" class="redRequire">
                                        <Input type="text" v-model="editDepart.depart_name" style="width:250px;"></Input>
                                    </FormItem>
                                </Col>
                                <div class="clear"></div>
                            </Form>
                            <Row style="padding:10px 20px;border-top:1px solid #e0e0e0;" class="margin-top-10">
                                <Col span="24">
                                    <Button type="primary" style="float:right;margin-left:20px;" @click="editSave">保存</Button>
                                    <Button type="default" style="float:right;" @click="editCancel">取消</Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
            </Card>
            </Col>
        </Row>
        <!-- 确认删除弹框 -->
        <Modal v-model='deleteModal' :mask-closable=false :width="300" class="orderForm-approvePass">
            <h3 slot="header">确认</h3>
            <div class="content">
                <span><Icon type="alert"></Icon></span>
                <span>
                    <P style="color:#cf0012;line-height: 40px;">确认<em style="font-style: normal;">删除</em>？</P>
                </span>
                <div class="clear"></div>
            </div>
            <div slot="footer">
                <Button type="text" @click="deleteCancel">取消</Button>
                <Button type="primary" :loading="loadding" @click="deleteSure">确定</Button>
            </div>
        </Modal>
        <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<script type="text/ecmascript-6">
    import {apiGetManagerDepartList, apiGetManagerDepartEdit, apiGetManagerDepartAdd, apiGetManagerDepartDelete } from '@/config/getData';
    import { notempty, sortBy, manualCheck, isInCreaters } from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        name: 'authority_organize_index',
        data () {
            const validateName = (rule, value, callback) => {
                if (value === '' || !value) {
                    return callback(new Error('请输入部门名称！'));
                } else {
                    callback();
                }
            };

            return {
                buy_user_list: [],
                formInput: '',
                baseData: [],
                spinShow: true,
                infoTitle: '',
                organizeInfo: {
                    company: '宜电慧创信息科技有限公司',
                    depart: '销售部',
                    work: '南京办',
                    uplevel: 'asas',
                    depart_no: '121',
                    depart_name: 'sdkls'
                },
                addDepart: {
                    uplevel: '1212',
                    depart_name: ''
                },
                editDepart: {
                    uplevel: '1212',
                    depart_no: '',
                    depart_name: ''
                },
                inforBlock: false,
                addBlock: false,
                editBlock: false,
                iconButtonGroup: false,
                deleteModal: false,
                loadding: false,
                dataChecked: '',
                currentNodeId: '',
                allParentsId: [],
                parentId: '',
                isExpand: false
            };
        },
        methods: {
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getData () {
                apiGetManagerDepartList(this, {
                    params: JSON.stringify(this.notempty({
                        depart_name: this.formInput,
                        is_expand: this.isExpand
                    }))   
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.inforBlock = false;
                        this.addBlock = false;
                        this.editBlock = false;
                        this.spinShow = false;
                        this.baseData = res.data;
                    }
                });
            },
            getInfo (node) {
                for (let i in node) {
                    if (this.parentId == node[i].id) {
                        this.organizeInfo.uplevel = node[i].title;
                        this.editDepart.uplevel = node[i].title;
                    }
                    this.getInfo(node[i].children);
                }
            },
            getNewInfo (nodeArr) {
                for (let i = nodeArr.length - 1; i >= 0; i--) {
                    if (nodeArr[i].id == this.currentNodeId) {
                        this.allParentsId.push(nodeArr[i].title);
                        this.currentNodeId = nodeArr[i].parent_id;
                        this.getNewInfo([this.baseData[1]]);
                    } else {
                        if (nodeArr[i].children && nodeArr[i].children.length > 0) {
                            this.getNewInfo(nodeArr[i].children);
                        }
                    }
                }
            },
            changeDepart (val) {
                if (val.length == 0) {
                    this.iconButtonGroup = false;
                    this.inforBlock = false;
                    this.addBlock = false;
                    this.editBlock = false;
                } else {
                    this.iconButtonGroup = true;
                    this.inforBlock = true;
                    this.addBlock = false;
                    this.editBlock = false;
                    this.dataChecked = val;
                    this.parentId = this.dataChecked[0].parent_id;
                    /*信息*/
                    this.organizeInfo.depart_no = val[0].id;
                    this.organizeInfo.depart_name = val[0].title;
                    /*修改信息*/
                    this.editDepart.depart_no = val[0].id;
                    this.editDepart.depart_name = val[0].title;
                    /*新增信息*/
                    this.addDepart.uplevel = val[0].title;
                    if (this.parentId == 0) {
                        this.organizeInfo.uplevel = '';
                        this.editDepart.uplevel = '';
                    }
                    /*获取上级名称*/
                    this.getInfo(this.baseData);
                    /*获取该部门的所有上级*/
                    this.currentNodeId = val[0].id;
                    this.allParentsId = [];
                    this.getNewInfo(this.baseData);
                    this.infoTitle = '';
                    for (let i in this.allParentsId) {
                        if (!this.infoTitle) {
                            this.infoTitle = this.allParentsId[i];
                        } else {
                            this.infoTitle = this.allParentsId[i] + ' — ' + this.infoTitle;
                        }
                    }
                }
            },
            editInfo () {
                this.inforBlock = false;
                this.addBlock = false;
                this.editBlock = true;
            },
            editSave () {
                if (!this.editDepart.depart_name) {
                    this.$Message.error('请输入部门名称！');
                    return;
                } else {
                    apiGetManagerDepartEdit(this, {
                        depart_id: this.editDepart.depart_no,
                        params: JSON.stringify({
                            depart_name: this.editDepart.depart_name
                        })    
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.isExpand = true;
                            this.getData();
                            this.iconButtonGroup = false;
                            this.inforBlock = false;
                            this.addBlock = false;
                            this.editBlock = false;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            editCancel () {
                // this.getData();
                this.inforBlock = true;
                this.addBlock = false;
                this.editBlock = false;
            },
            delInfo () {
                this.deleteModal = true;
                // this.inforBlock = false;
                // this.addBlock = true;
                // this.editBlock = false;
            },
            addInfo () {
                this.inforBlock = false;
                this.addBlock = true;
                this.addDepart.depart_name = '';
                this.editBlock = false;
            },
            /*新增保存*/
            addSave () {
                if (!this.addDepart.depart_name) {
                    this.$Message.error('请输入部门名称！');
                    return;
                } else {
                    apiGetManagerDepartAdd(this, {
                        params: JSON.stringify({
                            depart_name: this.addDepart.depart_name,
                            parent_id: this.dataChecked[0].id
                        })    
                    }).then(res => {
                        if (res && res.status == 1) {
                            //成功
                            this.isExpand = true;
                            this.getData();
                            this.iconButtonGroup = false;
                            this.inforBlock = false;
                            this.addBlock = false;
                            this.editBlock = false;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
            addCancel () {
                // this.getData();
                this.inforBlock = true;
                this.addBlock = false;
                this.editBlock = false;
            },
            deleteCancel () {
                this.deleteModal = false;
            },
            deleteSure () {
                apiGetManagerDepartDelete(this, {
                    depart_id: this.dataChecked[0].id   
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.isExpand = true;
                        this.getData();
                        this.iconButtonGroup = false;
                        this.inforBlock = false;
                        this.addBlock = false;
                        this.editBlock = false;
                        this.deleteModal = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                 });
            },
            search () {
                this.getData();
            }
        },
        created () {
            this.getData();
        },
        activated () {
            
        }
    };
</script>
