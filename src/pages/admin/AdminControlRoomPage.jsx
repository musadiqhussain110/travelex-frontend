import { useEffect, useMemo, useState } from "react"
import {
  FaCheckCircle,
  FaEye,
  FaLock,
  FaPlus,
  FaSearch,
  FaShieldAlt,
  FaSyncAlt,
  FaUserCheck,
  FaUserCog,
  FaUserSlash,
  FaUsers,
} from "react-icons/fa"

import { adminApi } from "../../services/api"
import { useAdminAuth } from "../../context/AdminAuthContext"

const fallbackRoles = [
  { value: "superAdmin", label: "Super Admin", permissions: {} },
  { value: "admin", label: "Admin", permissions: {} },
  { value: "consultant", label: "Consultant", permissions: {} },
  { value: "viewer", label: "Viewer", permissions: {} },
]

const roleBadgeClass = {
  superAdmin: "bg-orange-50 text-[#FF6B00]",
  admin: "bg-sky-50 text-[#00AEEF]",
  consultant: "bg-emerald-50 text-emerald-700",
  viewer: "bg-slate-100 text-slate-700",
}

const formatDate = (date) => {
  if (!date) return "Never"
  return new Date(date).toLocaleString()
}

const getInitials = (name = "") => {
  return (
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD"
  )
}

const countPermissions = (permissions = {}) => {
  return Object.values(permissions).reduce((total, modulePermissions) => {
    return (
      total +
      Object.values(modulePermissions || {}).filter((value) => value === true)
        .length
    )
  }, 0)
}

const AdminControlRoomPage = () => {
  const { admin } = useAdminAuth()

  const [roles, setRoles] = useState(fallbackRoles)
  const [members, setMembers] = useState([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 100,
    totalPages: 1,
  })

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "consultant",
  })

  const [resetForm, setResetForm] = useState({
    memberId: "",
    password: "",
  })

  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [actionLoading, setActionLoading] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const canCreateMembers =
    admin?.role === "superAdmin" ||
    admin?.permissions?.controlRoom?.createMembers !== false

  const canUpdateMembers =
    admin?.role === "superAdmin" ||
    admin?.permissions?.controlRoom?.updateMembers !== false

  const canDeactivateMembers =
    admin?.role === "superAdmin" ||
    admin?.permissions?.controlRoom?.deactivateMembers !== false

  const availableRoles = useMemo(() => {
    if (admin?.role === "superAdmin") return roles

    return roles.filter((role) => role.value !== "superAdmin")
  }, [roles, admin?.role])

  const stats = useMemo(() => {
    return {
      total: pagination.total || members.length,
      active: members.filter((member) => member.isActive).length,
      inactive: members.filter((member) => !member.isActive).length,
      admins: members.filter((member) =>
        ["superAdmin", "admin"].includes(member.role)
      ).length,
    }
  }, [members, pagination.total])

  const getQueryParams = () => {
    const params = {
      page: 1,
      limit: 100,
    }

    if (search.trim()) params.search = search.trim()
    if (roleFilter !== "All") params.role = roleFilter
    if (statusFilter !== "All") {
      params.isActive = statusFilter === "active"
    }

    return params
  }

  const loadAccessOptions = async () => {
    try {
      const data = await adminApi.getTeamAccessOptions()
      setRoles(data.roles || fallbackRoles)
    } catch {
      setRoles(fallbackRoles)
    }
  }

  const loadMembers = async () => {
    setLoading(true)
    setError("")

    try {
      const data = await adminApi.getTeamMembers(getQueryParams())

      setMembers(data.members || data.data?.members || [])
      setPagination(
        data.pagination ||
          data.data?.pagination || {
            total: data.total || 0,
            page: 1,
            limit: 100,
            totalPages: 1,
          }
      )
    } catch (err) {
      setError(err.message || "Failed to load team members.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAccessOptions()
    loadMembers()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()
    loadMembers()
  }

  const handleCreateMember = async (event) => {
    event.preventDefault()

    setCreating(true)
    setError("")
    setSuccess("")

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      }

      await adminApi.createTeamMember(payload)

      setForm({
        name: "",
        email: "",
        password: "",
        role: "consultant",
      })

      setSuccess("Team member created successfully.")
      await loadMembers()
    } catch (err) {
      setError(err.message || "Failed to create team member.")
    } finally {
      setCreating(false)
    }
  }

  const handleRoleChange = async (member, nextRole) => {
    if (!member?._id || member.role === nextRole) return

    setActionLoading(`${member._id}-role`)
    setError("")
    setSuccess("")

    try {
      const data = await adminApi.updateTeamMember(member._id, {
        role: nextRole,
      })

      const updatedMember = data.member

      setMembers((prev) =>
        prev.map((item) =>
          item._id === member._id ? { ...item, ...updatedMember } : item
        )
      )

      setSuccess(`${member.name} role updated successfully.`)
    } catch (err) {
      setError(err.message || "Failed to update role.")
    } finally {
      setActionLoading("")
    }
  }

  const handleToggleStatus = async (member) => {
    if (!member?._id) return

    const nextStatus = !member.isActive

    setActionLoading(`${member._id}-status`)
    setError("")
    setSuccess("")

    try {
      const data = await adminApi.updateTeamMemberStatus(
        member._id,
        nextStatus
      )

      const updatedMember = data.member

      setMembers((prev) =>
        prev.map((item) =>
          item._id === member._id ? { ...item, ...updatedMember } : item
        )
      )

      setSuccess(
        nextStatus
          ? `${member.name} activated successfully.`
          : `${member.name} deactivated successfully.`
      )
    } catch (err) {
      setError(err.message || "Failed to update member status.")
    } finally {
      setActionLoading("")
    }
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()

    if (!resetForm.memberId || !resetForm.password) {
      setError("Please select member and enter new password.")
      return
    }

    setResetting(true)
    setError("")
    setSuccess("")

    try {
      await adminApi.resetTeamMemberPassword(
        resetForm.memberId,
        resetForm.password
      )

      setResetForm({
        memberId: "",
        password: "",
      })

      setSuccess("Password reset successfully.")
    } catch (err) {
      setError(err.message || "Failed to reset password.")
    } finally {
      setResetting(false)
    }
  }

  const handleRefresh = async () => {
    await loadMembers()
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#00AEEF] sm:text-xs">
              Team Access Management
            </p>

            <h1 className="mt-1 font-fredoka text-[32px] font-semibold leading-tight text-slate-950 sm:text-[40px]">
              Control Room
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-sm font-medium leading-6 text-slate-500">
              Manage TravelEx CRM team members, roles, permissions, and limited
              access from one dedicated place.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-4 py-2.5 font-poppins text-sm font-semibold text-slate-700 transition hover:border-[#00AEEF] hover:text-[#00AEEF] disabled:opacity-50"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </section>

      {success && (
        <div className="rounded-[5px] border border-emerald-100 bg-emerald-50 px-5 py-4 font-poppins text-sm font-semibold text-emerald-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-[5px] border border-red-100 bg-red-50 px-5 py-4 font-poppins text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-orange-50 text-[#FF6B00]">
            <FaUsers />
          </div>

          <p className="mt-4 font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Total Members
          </p>

          <p className="mt-1 font-fredoka text-[30px] font-semibold text-slate-950">
            {stats.total}
          </p>
        </div>

        <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-emerald-50 text-emerald-700">
            <FaUserCheck />
          </div>

          <p className="mt-4 font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Active Members
          </p>

          <p className="mt-1 font-fredoka text-[30px] font-semibold text-slate-950">
            {stats.active}
          </p>
        </div>

        <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-red-50 text-red-600">
            <FaUserSlash />
          </div>

          <p className="mt-4 font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Inactive Members
          </p>

          <p className="mt-1 font-fredoka text-[30px] font-semibold text-slate-950">
            {stats.inactive}
          </p>
        </div>

        <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-sky-50 text-[#00AEEF]">
            <FaShieldAlt />
          </div>

          <p className="mt-4 font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Admin Access
          </p>

          <p className="mt-1 font-fredoka text-[30px] font-semibold text-slate-950">
            {stats.admins}
          </p>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-5">
          <form
            onSubmit={handleCreateMember}
            className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[5px] bg-[#FF6B00]/10 text-[#FF6B00]">
                <FaPlus />
              </div>

              <div>
                <h2 className="font-fredoka text-[26px] font-semibold text-slate-950">
                  Add Member
                </h2>

                <p className="font-poppins text-sm font-medium text-slate-500">
                  Create limited CRM access for staff.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Full name"
                required
                disabled={!canCreateMembers}
                className="h-11 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none transition focus:border-[#00AEEF] disabled:opacity-60"
              />

              <input
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="Email address"
                type="email"
                required
                disabled={!canCreateMembers}
                className="h-11 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none transition focus:border-[#00AEEF] disabled:opacity-60"
              />

              <input
                value={form.password}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                placeholder="Temporary password"
                type="password"
                required
                minLength={8}
                disabled={!canCreateMembers}
                className="h-11 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none transition focus:border-[#00AEEF] disabled:opacity-60"
              />

              <select
                value={form.role}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, role: event.target.value }))
                }
                disabled={!canCreateMembers}
                className="h-11 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none transition focus:border-[#00AEEF] disabled:opacity-60"
              >
                {availableRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={creating || !canCreateMembers}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-4 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaPlus />
                {creating ? "Creating..." : "Create Member"}
              </button>
            </div>
          </form>

          <form
            onSubmit={handleResetPassword}
            className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[5px] bg-slate-100 text-slate-700">
                <FaLock />
              </div>

              <div>
                <h2 className="font-fredoka text-[26px] font-semibold text-slate-950">
                  Reset Password
                </h2>

                <p className="font-poppins text-sm font-medium text-slate-500">
                  Set a new temporary password.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <select
                value={resetForm.memberId}
                onChange={(event) =>
                  setResetForm((prev) => ({
                    ...prev,
                    memberId: event.target.value,
                  }))
                }
                disabled={!canUpdateMembers}
                className="h-11 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none transition focus:border-[#00AEEF] disabled:opacity-60"
              >
                <option value="">Select member</option>
                {members
                  .filter((member) => member._id !== admin?.id)
                  .map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} - {member.email}
                    </option>
                  ))}
              </select>

              <input
                value={resetForm.password}
                onChange={(event) =>
                  setResetForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                placeholder="New temporary password"
                type="password"
                minLength={8}
                disabled={!canUpdateMembers}
                className="h-11 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none transition focus:border-[#00AEEF] disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={resetting || !canUpdateMembers}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[5px] bg-slate-950 px-4 font-poppins text-sm font-semibold text-white transition hover:bg-[#FF6B00] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaLock />
                {resetting ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="font-fredoka text-[28px] font-semibold text-slate-950">
                Team Members
              </h2>

              <p className="font-poppins text-sm font-medium text-slate-500">
                Manage active CRM users and their access roles.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <div className="flex h-10 items-center gap-2 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3">
                <FaSearch className="text-xs text-slate-400" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search member..."
                  className="min-w-0 bg-transparent font-poppins text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="h-10 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none"
              >
                <option value="All">All Roles</option>
                {availableRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none"
              >
                <option value="All">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[5px] bg-[#00AEEF] px-4 font-poppins text-sm font-semibold text-white transition hover:bg-[#FF6B00]"
              >
                Search
              </button>
            </form>
          </div>

          <div className="mt-5 grid gap-3">
            {loading ? (
              [1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-[5px] bg-[#F8FAFC]"
                />
              ))
            ) : members.length === 0 ? (
              <div className="rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-8 text-center">
                <FaEye className="mx-auto text-2xl text-slate-300" />

                <p className="mt-3 font-poppins text-sm font-semibold text-slate-500">
                  No team members found.
                </p>
              </div>
            ) : (
              members.map((member) => (
                <article
                  key={member._id}
                  className="rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-4"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[5px] bg-slate-950 font-fredoka text-lg font-semibold text-white">
                        {getInitials(member.name)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-poppins text-sm font-bold text-slate-950">
                            {member.name}
                          </h3>

                          <span
                            className={`rounded-[5px] px-2 py-1 font-poppins text-[10px] font-bold uppercase ${
                              roleBadgeClass[member.role] ||
                              "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {member.roleLabel || member.role}
                          </span>

                          <span
                            className={`rounded-[5px] px-2 py-1 font-poppins text-[10px] font-bold uppercase ${
                              member.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {member.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <p className="mt-1 break-all font-poppins text-xs font-semibold text-slate-500">
                          {member.email}
                        </p>

                        <p className="mt-1 font-poppins text-[11px] font-medium text-slate-400">
                          Last login: {formatDate(member.lastLogin)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <select
                        value={member.role}
                        onChange={(event) =>
                          handleRoleChange(member, event.target.value)
                        }
                        disabled={
                          !canUpdateMembers ||
                          actionLoading === `${member._id}-role`
                        }
                        className="h-10 rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-bold text-slate-700 outline-none disabled:opacity-50"
                      >
                        {availableRoles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(member)}
                        disabled={
                          !canDeactivateMembers ||
                          actionLoading === `${member._id}-status` ||
                          member._id === admin?.id
                        }
                        className={`inline-flex h-10 items-center justify-center gap-2 rounded-[5px] px-3 font-poppins text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          member.isActive
                            ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                        }`}
                      >
                        {member.isActive ? <FaUserSlash /> : <FaUserCheck />}
                        {actionLoading === `${member._id}-status`
                          ? "Updating..."
                          : member.isActive
                            ? "Deactivate"
                            : "Activate"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                    <span className="rounded-[5px] bg-white px-2.5 py-1 font-poppins text-[11px] font-bold text-slate-500">
                      {countPermissions(member.permissions)} permissions
                    </span>

                    {member.permissions?.leads?.export && (
                      <span className="rounded-[5px] bg-white px-2.5 py-1 font-poppins text-[11px] font-bold text-[#00AEEF]">
                        Export access
                      </span>
                    )}

                    {member.permissions?.controlRoom?.view && (
                      <span className="rounded-[5px] bg-white px-2.5 py-1 font-poppins text-[11px] font-bold text-[#FF6B00]">
                        Control room access
                      </span>
                    )}

                    {member.permissions?.leads?.update && (
                      <span className="inline-flex items-center gap-1 rounded-[5px] bg-white px-2.5 py-1 font-poppins text-[11px] font-bold text-emerald-700">
                        <FaCheckCircle />
                        Lead update access
                      </span>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminControlRoomPage