<template>
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="镜像名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getImage">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">添加镜像</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="image" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
		<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" label="序号" width="120">
			</el-table-column>
			<el-table-column prop="name" label="镜像名称" width="180" sortable>
			</el-table-column>
			<el-table-column prop="type" label="类型" width="150"  sortable>
			</el-table-column>
			<el-table-column prop="state" label="状态" width="150"  sortable>
			</el-table-column>
			<el-table-column prop="isPublic" label="公有"  width="150" :formatter="formatPublic"  sortable>
			</el-table-column>
			<el-table-column prop="isProtected" label="受保护"  width="150" :formatter="formatProtected" sortable>
			</el-table-column>
			<el-table-column prop="diskFormat" label="格式"  width="150" sortable>
			</el-table-column>
			<el-table-column prop="size" label="配置"  width="150" sortable>
			</el-table-column>
		
			
			<el-table-column label="操作" width="350">
				<template scope="scope">
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="用户名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editForm.email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="项目">
					<el-select v-model="addForm.tenantId" clearable  placeholder="请选择">
    					<el-option
      						v-for="item in project"
      						:key="item.id"
      						:label="item.name"
      						:value="item.id">
    					</el-option>
  					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		
		<!--新增界面-->
		<el-dialog title="新建用户" v-model="addFormVisible" :close-on-click-modal="false" width="30%">
			<el-form :model="addForm" label-width="120px"  ref="addForm"  style        ="width:500px;">
				<el-form-item label="用户名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addForm.email" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password" >
					<el-input type="password" placeholder="密码" v-model="addForm.password" show-password></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="password_confirm" >
					<el-input type="password" placeholder="确认密码" v-model="addForm.password_confirm" show-password></el-input>
				</el-form-item>
				<el-form-item label="项目">
					<el-select v-model="addForm.tenantId" clearable  placeholder="请选择">
    					<el-option
      						v-for="item in project"
      						:key="item.id"
      						:label="item.name"
      						:value="item.id">
    					</el-option>
  					</el-select>
				</el-form-item>
				<el-form-item label="角色">
					<el-select v-model="addForm.roleId" clearable  placeholder="请选择">
    					<el-option
      						v-for="item in role"
      						:key="item.id"
      						:label="item.name"
      						:value="item.id">
    					</el-option>
  					</el-select>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getImageList, deleteUser, addUser, editUser, getProjectList, getRoleList, enableUser,editPasswordUser} from '../../api/api';

	export default {
		data() {
			
			return {
				filters: {
					name: ''
				},
				image: [],
				project:[],
				role: [],
				total: 0,
				page: 1,
				consoleUrl:'',
				listLoading: false,

				editFormVisible: false,//编辑界面是否显示
				
				editLoading: false,
				
				//编辑界面数据
				editPasswordForm: {
					id: 0,
					name: '',
					password: ''
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					email: '',
					tenantId: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				
				//新增界面数据
				addForm: {
					name: '',
					email: '',
					password: '',
					tenantId: '',
					roleId: ''
				}
			}
		},
		methods: {
			formatPublic: function (row, column) {
				return row.isPublic ? '是' :  '否' ;
			},
			formatProtected: function (row, column) {
				return row.isProtected ? '是' :  '否' ;
			},
			
			handleCurrentChange(val) {
				this.page = val;
				this.getImage();
			},
			//获取用户列表
			getImage() {
				let para = {
					page: this.page
				};
				this.listLoading = true;
				//NProgress.start();
				getImageList(para).then((res) => {
					this.total = res.data.total;
					this.image = res.data;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { userId: row.id };
					deleteUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						console.log(res);
						console.log(row.id);
						this.getImage();
					});
				}).catch(() => {

				});
			},

			//禁用
			handleEnable: function (index, row) {
				this.$confirm('确认禁用该用户吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { userId: row.id,enable:!row.state };
					console.log(para);
					enableUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '操作成功',
							type: 'success'
						});
						
						console.log(row.id);
						this.getImage();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示编辑界面
			handleEditPassword: function (index, row) {
				this.editPasswordFormVisible = true;
				this.editPasswordForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					id: '',
					email: '',
					name: '',
					password: '',
					roleId: '',
					tenantId: ''
				};
			},
			
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							console.log(this.editForm);
							console.log(para);
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getImage();
							});
						});
					}
				});
			},
			//修改密码
			editPasswordSubmit: function () {
				this.$refs.editPasswordForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editPasswordForm);
							console.log(this.editPasswordForm);
							console.log(para);
							editPasswordUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editPasswordForm'].resetFields();
								this.editPasswordFormVisible = false;
								this.getImage();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							console.log(this.addForm);
							//let para =this.addForm;
							console.log(para);
							addUser(para).then((res) => {

								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								console.log(res);
								this.getImage();
							});
							
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
		},
		mounted() {
			this.getImage();
			
		}
	}

</script>

<style scoped>

</style>