<template>
  <div class="page">
    <header class="hero">
      <div>
        <p class="eyebrow">Stay positive for a great and better future</p>
        <h1>What activities should we enjoy today?</h1>
        <p class="lede">Productively manage your activities with detailed schedules and clear priorities.</p>

        <div class="tag-rail" role="group" aria-label="Activity filters">
          <button v-for="tag in tags" :key="tag" type="button" class="pill">{{ tag }}</button>
        </div>
      </div>
      <div class="month-badge">Monthly schedule</div>
    </header>

    <section class="panel">
      <header class="panel-heading">
        <div>
          <p class="label">Today's schedule</p>
          <h2>All activities</h2>
          <p class="muted">Detailed list for the month</p>
        </div>
        <button class="ghost">See more →</button>
      </header>

      <div class="card-grid">
        <article v-for="activity in activities" :key="activity.id" class="card">
          <div class="card-top">
            <div class="badge-row">
              <span class="status" :style="{ color: activity.accent }">{{ activity.title }}</span>
              <span class="pill soft">{{ activity.day }}</span>
            </div>
            <p class="small">{{ activity.subtitle }}</p>
          </div>
          <div class="card-meta">
            <div class="time">{{ activity.time }}</div>
            <p class="small">{{ activity.location }}</p>
          </div>
          <div class="card-actions">
            <button class="soft-btn">Edit</button>
            <button class="soft-btn">Complete</button>
          </div>
        </article>
      </div>
    </section>

    <section class="panel">
      <header class="panel-heading">
        <div>
          <p class="label">One time activities</p>
          <h2>Weekend events</h2>
          <p class="muted">Detailed list for the weekends</p>
        </div>
        <button class="ghost">See more →</button>
      </header>

      <div class="stack">
        <article v-for="event in weekendEvents" :key="event.id" class="card">
          <div class="card-top">
            <div class="badge-row">
              <span class="status" :style="{ color: event.accent }">{{ event.title }}</span>
              <span class="pill soft">{{ event.day }}</span>
            </div>
            <p class="small">{{ event.subtitle }}</p>
          </div>
          <div class="card-meta">
            <div class="time">{{ event.time }}</div>
            <p class="small">{{ event.location }}</p>
          </div>
          <div class="card-actions">
            <button class="soft-btn">Edit</button>
            <button class="soft-btn primary">Complete</button>
          </div>
        </article>
      </div>
    </section>

    <section class="panel">
      <header class="panel-heading">
        <div>
          <p class="label">Recurring activities</p>
          <h2>Weekly activities</h2>
          <p class="muted">Detailed list for the week</p>
        </div>
        <button class="ghost">See more →</button>
      </header>

      <div class="stack">
        <article v-for="item in weeklyActivities" :key="item.id" class="card">
          <div class="card-top">
            <div class="badge-row">
              <span class="status" :style="{ color: item.accent }">{{ item.title }}</span>
              <span class="pill soft">{{ item.day }}</span>
            </div>
            <p class="small">{{ item.subtitle }}</p>
          </div>
          <div class="card-meta">
            <div class="time">{{ item.time }}</div>
            <p class="small">{{ item.location }}</p>
          </div>
          <div class="card-actions">
            <button class="soft-btn">Edit</button>
            <button class="soft-btn primary">Complete</button>
          </div>
        </article>
      </div>
    </section>

    <section class="columns">
      <div class="panel tasks">
        <div class="panel-heading">
          <div>
            <p class="label">Tasks</p>
            <h2>What activity will we do today?</h2>
            <p class="muted">In this week (04 - 08 Dec 2019)</p>
          </div>
          <button class="ghost">View in calendar</button>
        </div>

        <div class="task-columns">
          <div class="task-list">
            <h3>Today</h3>
            <ul>
              <li v-for="task in todaysTasks" :key="task.id">
                <label class="check">
                  <input type="checkbox" v-model="task.done" />
                  <span class="control"></span>
                  <div>
                    <p class="task-title">{{ task.title }}</p>
                    <p class="muted">{{ task.time }}</p>
                  </div>
                </label>
              </li>
            </ul>
          </div>
          <div class="task-list">
            <h3>Yesterday</h3>
            <ul>
              <li v-for="task in yesterdayTasks" :key="task.id">
                <label class="check">
                  <input type="checkbox" v-model="task.done" />
                  <span class="control"></span>
                  <div>
                    <p class="task-title">{{ task.title }}</p>
                    <p class="muted">{{ task.time }}</p>
                  </div>
                </label>
              </li>
            </ul>
          </div>
          <div class="task-list">
            <h3>Archived</h3>
            <ul>
              <li v-for="task in archivedTasks" :key="task.id">
                <label class="check">
                  <input type="checkbox" v-model="task.done" />
                  <span class="control"></span>
                  <div>
                    <p class="task-title">{{ task.title }}</p>
                    <p class="muted">{{ task.time }}</p>
                  </div>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="panel add-task">
        <div class="pill highlight">Have you added your project task?</div>
        <h2>Add new task</h2>
        <p class="muted">Once added you will not skip it</p>

        <form class="new-task" @submit.prevent="addNewTask">
          <label>
            <span>Activity name</span>
            <input v-model.trim="newTask.title" type="text" placeholder="Morning routine" required />
          </label>
          <label>
            <span>From</span>
            <input v-model="newTask.from" type="time" required />
          </label>
          <label>
            <span>To</span>
            <input v-model="newTask.to" type="time" required />
          </label>
          <label>
            <span>Date</span>
            <input v-model="newTask.date" type="date" required />
          </label>
          <button type="submit" class="primary-btn">+ Add schedule</button>
        </form>
      </div>
    </section>

    <section class="panel related">
      <div class="related-card">
        <div class="pill highlight">Related to the project</div>
        <h3>Update meeting room</h3>
        <p class="muted">Connect all related computers to the hard drives</p>
        <p class="muted">Large whiteboard</p>
        <div class="inline-select">
          <label>
            <span>Set time</span>
            <select>
              <option>Today</option>
              <option>Tomorrow</option>
              <option>This week</option>
            </select>
          </label>
          <label>
            <span>Assigned</span>
            <select>
              <option>Max</option>
              <option>Vini</option>
              <option>Juicer</option>
            </select>
          </label>
        </div>
        <div class="card-actions">
          <button class="soft-btn">Edit</button>
          <button class="soft-btn primary">Complete</button>
        </div>
      </div>

      <div class="related-card">
        <div class="pill highlight">Related to the project</div>
        <h3>Design Documentation</h3>
        <p class="muted">Connect all related computers to the hard drives</p>
        <p class="muted">Include checkpoints and visuals</p>
        <div class="inline-select">
          <label>
            <span>Set time</span>
            <select>
              <option>Today</option>
              <option>Tomorrow</option>
              <option>This week</option>
            </select>
          </label>
          <label>
            <span>Assigned</span>
            <select>
              <option>Max</option>
              <option>Vini</option>
              <option>Juicer</option>
            </select>
          </label>
        </div>
        <div class="card-actions">
          <button class="soft-btn">Edit</button>
          <button class="soft-btn primary">Complete</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tags = [
  'Swimming',
  'Music',
  'Dancing',
  'Gym',
  'Sports',
  'Art',
  'Gymnastic',
  'Shoes',
  'Weapons',
  'Tools',
]

const activities = ref([
  {
    id: 'a1',
    title: 'Activity 1: Attend chemistry class',
    subtitle: 'pH and catalysts',
    day: 'Today',
    time: '10:35 am - 4:35 pm',
    location: 'Present in auditorium (Block 1)',
    accent: '#2ed9d9',
  },
  {
    id: 'a2',
    title: 'Activity 2: Attend math class',
    subtitle: 'Algebraic formula',
    day: 'Today',
    time: '10:35 am - 4:35 pm',
    location: 'Present in class (Block 1)',
    accent: '#eab308',
  },
  {
    id: 'a3',
    title: 'Activity 3: Attend meeting with global folks',
    subtitle: 'Green marketing for organic products',
    day: 'Tomorrow',
    time: '10:35 am - 4:35 pm',
    location: 'Present in meeting room (Block 1)',
    accent: '#22c55e',
  },
  {
    id: 'a4',
    title: 'Activity 4: Grab some groceries',
    subtitle: 'Essential vegetables, fruits, and detergent',
    day: 'Today',
    time: '10:35 am - 4:35 pm',
    location: 'Marketplace (Block 10)',
    accent: '#a855f7',
  },
  {
    id: 'a5',
    title: 'Activity 5: Walk the dog',
    subtitle: 'Include optional exercise',
    day: 'Today',
    time: '10:35 am - 4:35 pm',
    location: 'Area (Block 1)',
    accent: '#9f7aea',
  },
  {
    id: 'a6',
    title: 'Activity 6: Listen to the podcast',
    subtitle: 'Enjoy music while working',
    day: 'Tomorrow',
    time: '10:35 am - 4:35 pm',
    location: 'Workplace (Block 1)',
    accent: '#3b82f6',
  },
])

const weekendEvents = ref([
  {
    id: 'w1',
    title: 'Activity 1: Enjoy hiking with family',
    subtitle: 'Basic essentials like medicine and comfortable shoes',
    day: 'Today',
    time: '10:35 am - 4:35 pm',
    location: 'Hill viewpoint',
    accent: '#f97316',
  },
  {
    id: 'w2',
    title: 'Activity 2: Enjoy pizza at a new joint',
    subtitle: 'Explore different tastes and crust styles',
    day: 'Today',
    time: '10:35 am - 4:35 pm',
    location: 'Italian restaurant',
    accent: '#22c55e',
  },
])

const weeklyActivities = ref([
  {
    id: 'r1',
    title: 'Activity 1: Buy wheat for the bird',
    subtitle: 'After that wash clothes and iron',
    day: 'Today',
    time: '10:35 am - 4:35 pm',
    location: 'Supermarket',
    accent: '#f43f5e',
  },
  {
    id: 'r2',
    title: 'Activity 2: Wash the car',
    subtitle: 'Tighten loose nuts and bolts',
    day: 'Today',
    time: '10:35 am - 4:35 pm',
    location: 'Car deck',
    accent: '#22c55e',
  },
])

const todaysTasks = ref([
  { id: 't1', title: 'Attend a conference', time: '10:30 am', done: true },
  { id: 't2', title: 'Go to the gym', time: '11:15 am', done: false },
  { id: 't3', title: 'Marketing meeting with influencer', time: '1:25 pm', done: false },
  { id: 't4', title: 'Zoom meeting with reviewer', time: '1:55 pm', done: false },
  { id: 't5', title: 'Lunch break', time: '2:25 pm', done: true },
  { id: 't6', title: 'Attend a conference', time: '2:50 pm', done: false },
])

const yesterdayTasks = ref([
  { id: 'y1', title: 'Joining the meeting', time: '9:30 am', done: true },
  { id: 'y2', title: 'Logistics', time: '10:30 am', done: false },
  { id: 'y3', title: 'Conduct interview', time: '11:45 am', done: true },
  { id: 'y4', title: 'Lunch break', time: '2:25 pm', done: true },
])

const archivedTasks = ref([
  { id: 'z1', title: 'Joining the meeting', time: '9:30 am', done: true },
  { id: 'z2', title: 'Logistics', time: '10:30 am', done: true },
  { id: 'z3', title: 'Conduct interview', time: '11:45 am', done: true },
  { id: 'z4', title: 'Lunch break', time: '2:25 pm', done: true },
])

const newTask = ref({ title: '', from: '', to: '', date: '' })

const addNewTask = () => {
  if (!newTask.value.title || !newTask.value.from || !newTask.value.to || !newTask.value.date) {
    return
  }

  const friendlyDate = new Date(newTask.value.date)
  const dayLabel = friendlyDate.toLocaleDateString(undefined, { weekday: 'long' })
  activities.value.unshift({
    id: crypto.randomUUID(),
    title: newTask.value.title,
    subtitle: 'Added from quick form',
    day: dayLabel,
    time: `${newTask.value.from} - ${newTask.value.to}`,
    location: 'Scheduled by you',
    accent: '#6366f1',
  })

  newTask.value = { title: '', from: '', to: '', date: '' }
}
</script>
