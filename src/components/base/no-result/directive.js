import NoResult from './no-result'
import createLoadingLikeDirective from '@/assets/js/create-loading-like-directive'

const noResultDirective = createLoadingLikeDirective(NoResult)
console.log('noResultDirective', noResultDirective)

export default noResultDirective
