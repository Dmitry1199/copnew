import { supabase, handleSupabaseError, type Client, type TablesInsert, type TablesUpdate } from '../supabase'

export class ClientsAPI {
  // Отримати всіх клієнтів тренера
  static async getClients(trainerId: string): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('trainer_id', trainerId)
        .order('created_at', { ascending: false })

      if (error) handleSupabaseError(error)
      return data || []
    } catch (error) {
      console.error('Error fetching clients:', error)
      throw error
    }
  }

  // Отримати клієнта за ID
  static async getClient(clientId: string): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single()

      if (error && error.code !== 'PGRST116') handleSupabaseError(error)
      return data || null
    } catch (error) {
      console.error('Error fetching client:', error)
      throw error
    }
  }

  // Створити нового клієнта
  static async createClient(clientData: TablesInsert<'clients'>): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        // @ts-ignore - временное решение для типов Supabase
        .insert(clientData)
        .select('*')
        .single()

      if (error) handleSupabaseError(error)
      if (!data) throw new Error('No data returned from insert')
      return data
    } catch (error) {
      console.error('Error creating client:', error)
      throw error
    }
  }

  // Оновити клієнта
  static async updateClient(clientId: string, updates: TablesUpdate<'clients'>): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        // @ts-ignore - временное решение для типов Supabase
        .update(updates)
        .eq('id', clientId)
        .select('*')
        .single()

      if (error) handleSupabaseError(error)
      if (!data) throw new Error('No data returned from update')
      return data
    } catch (error) {
      console.error('Error updating client:', error)
      throw error
    }
  }

  // Видалити клієнта
  static async deleteClient(clientId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)

      if (error) handleSupabaseError(error)
    } catch (error) {
      console.error('Error deleting client:', error)
      throw error
    }
  }

  // Пошук клієнтів
  static async searchClients(trainerId: string, query: string): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('trainer_id', trainerId)
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) handleSupabaseError(error)
      return data || []
    } catch (error) {
      console.error('Error searching clients:', error)
      throw error
    }
  }

  // Отримати клієнтів за статусом
  static async getClientsByStatus(trainerId: string, status: 'active' | 'inactive' | 'archived'): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('trainer_id', trainerId)
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) handleSupabaseError(error)
      return data || []
    } catch (error) {
      console.error('Error fetching clients by status:', error)
      throw error
    }
  }

  // Отримати статистику клієнтів
  static async getClientsStats(trainerId: string): Promise<{
    total: number
    active: number
    inactive: number
    newThisMonth: number
  }> {
    try {
      // Загальна кількість
      const { count: total, error: totalError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)

      if (totalError) handleSupabaseError(totalError)

      // Активні клієнти
      const { count: active, error: activeError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)
        .eq('status', 'active')

      if (activeError) handleSupabaseError(activeError)

      // Неактивні клієнти
      const { count: inactive, error: inactiveError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)
        .eq('status', 'inactive')

      if (inactiveError) handleSupabaseError(inactiveError)

      // Нові клієнти цього місяця
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count: newThisMonth, error: newError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)
        .gte('created_at', startOfMonth.toISOString())

      if (newError) handleSupabaseError(newError)

      return {
        total: total || 0,
        active: active || 0,
        inactive: inactive || 0,
        newThisMonth: newThisMonth || 0
      }
    } catch (error) {
      console.error('Error fetching clients stats:', error)
      throw error
    }
  }

  // Архівувати клієнта (м'яке видалення)
  static async archiveClient(clientId: string): Promise<Client> {
    return this.updateClient(clientId, { status: 'archived' })
  }

  // Відновити клієнта з архіву
  static async unarchiveClient(clientId: string): Promise<Client> {
    return this.updateClient(clientId, { status: 'active' })
  }

  // Отримати повне ім'я клієнта
  static getFullName(client: Client): string {
    return `${client.first_name} ${client.last_name}`
  }

  // Отримати ініціали клієнта
  static getInitials(client: Client): string {
    return `${client.first_name[0]}${client.last_name[0]}`
  }

  // Валідація email
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Валідація телефону (український формат)
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^\+380\d{9}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  // Форматування телефону
  static formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('380')) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 12)}`
    }
    return phone
  }
}
