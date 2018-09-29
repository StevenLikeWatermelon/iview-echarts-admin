<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="khInfo" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="khInfo.khmc" placeholder="输入客户名称" @on-enter="search"></Input>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
                <el-table :data="khData.data" border stripe style="text-align: center" max-height="570">
                    <el-table-column prop="khbh" label="客户编号" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="khmc" label="客户名称" min-width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="serivce_name" label="所属客服" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="serivce_depart" label="客服部门" min-width="90" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="sale_name" label="所属销售" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="sale_depart" label="销售部门" min-width="90" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="is_deleted" label="客户状态" show-overflow-tooltip min-width="80">
                        <template slot-scope="scope">
                        <span> {{khStatus[scope.row.is_deleted]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import { apiCustomerList} from '@/config/getData';
    import { sortBy } from '@/config/mUtils';
    export default {
        name: 'custom_search_index',
        data () {
            return {
                khInfo: {
                    khmc: '',
                },
                khData: {
                    title: [],
                    data: []
                },
                khStatus:{
                    '0':'启用',
                    '1':'禁用'
                }
            };
        },

        methods: {
            getData () {
                apiCustomerList(this, {
                    params: JSON.stringify({
                        khmc: this.khInfo.khmc
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.khData.data = res.data;
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            search () {
                this.getData();
            },
            reset () {
                this.khInfo.khmc = '';
            },

        },
        created () {
        }
    };
</script>
